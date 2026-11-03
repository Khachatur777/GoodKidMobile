import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Pressable, useWindowDimensions, View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { IMathCategory, IMathQuestion, ISubmittedAnswer } from 'models';
import { useFinishSessionMutation, useStartMathSessionMutation } from 'rtk';
import { mathCardStyles } from './math-card-styles.ts';
import { useAnswerSounds } from 'hooks';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

// Base font sizes of the formula, the same as in the styles; they are needed
// here to work out how much the line has to shrink.
const FORMULA = { operand: 72, operator: 58, equals: 54 };

type Feedback = 'idle' | 'correct' | 'wrong';

export interface MathCardProps {
  // replace comes from the stack navigator; the base type does not know it.
  navigation: NavigationProp<any> & {
    replace: (name: string, params?: object) => void;
  };
  route: RouteProp<{ params: { category: IMathCategory } }, 'params'>;
}

const MathCard: FC<MathCardProps> = ({ navigation, route }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => mathCardStyles(color), [color]);
  const { width: screenWidth } = useWindowDimensions();
  const category = route.params?.category;

  const [startSession] = useStartMathSessionMutation();
  const [finishSession] = useFinishSessionMutation();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<IMathQuestion[]>([]);
  const [maxDigits, setMaxDigits] = useState(3);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');

  // Answers pile up here, not on the server: the session is sent in one request
  // at the end, so a dropped connection midway does not cost the child what
  // they earned.
  const answers = useRef<Map<string, ISubmittedAnswer>>(new Map());
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;

    startSession({ operation: category.operation, showModal: true })
      .unwrap()
      .then(response => {
        if (cancelled) return;
        setSessionId(response.data.sessionId);
        setQuestions(response.data.questions);
        // A lower bound on the app's side: however many digits the server
        // names, they must fit the largest answer in this category. Otherwise
        // the child gets "898 + 417" with three places for the answer, the
        // right answer cannot be typed at all, and no attempt helps.
        const needed = String(Math.max(1, category.maxResult || 0)).length;
        setMaxDigits(Math.max(response.data.answerMaxDigits || 1, needed));
      })
      .catch(error => {
        if (cancelled) return;
        // Sessions belong to the child: the stars and progress are theirs. A
        // parent who opens the section should be told so, not left with an
        // empty screen.
        const message =
          error?.data?.message === 'child_only'
            ? t('learning_child_only')
            : t('cards_offline_hint');

        Alert.alert(t('learning_child_only_title'), message, [
          { text: t('close'), onPress: () => navigation.goBack() },
        ]);
      });

    return () => {
      cancelled = true;
    };
  }, [category.operation, startSession]);

  const question = questions[index];
  const [left, operator, right] = (question?.expression || '').split(' ');

  // "120 + 345 = 465" must read like "2 + 3 = 5", on one line. The size is
  // computed from the number of characters rather than picked by eye, and one
  // factor applies to every part, so digits and signs keep their proportions.
  const answerText = feedback === 'correct' ? String(question?.correctValue ?? '') : '?';
  const formulaScale = useMemo(() => {
    const digits = `${left || ''}${right || ''}${answerText}`.length;
    if (!digits) return 1;

    // 0.62 is this typeface's digit width relative to its size; 48 is the four
    // gaps between five parts, 40 the screen margins, 32 the card padding.
    const needed = 0.62 * (FORMULA.operand * digits + FORMULA.operator + FORMULA.equals);
    const budget = screenWidth - 40 - 48 - 32;

    return Math.min(1, budget / needed);
  }, [left, right, answerText, screenWidth]);

  const scaled = useCallback(
    (fontSize: number, lineHeight: number) => ({
      fontSize: fontSize * formulaScale,
      lineHeight: lineHeight * formulaScale,
    }),
    [formulaScale],
  );

  const { playCorrect, playWrong } = useAnswerSounds();

  const recordAttempt = useCallback(
    (answered: number | null) => {
      if (!question) return 0;

      const previous = answers.current.get(question.questionId);
      const attempts = (previous?.attempts || 0) + 1;
      answers.current.set(question.questionId, {
        questionId: question.questionId,
        value: answered,
        attempts,
      });
      return attempts;
    },
    [question],
  );

  const goNext = useCallback(async () => {
    setValue('');
    setFeedback('idle');

    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }

    // A parent's preview: there is no session, nothing to count or reward.
    if (!sessionId) {
      navigation.goBack();
      return;
    }

    try {
      const result = await finishSession({
        sessionId,
        answers: Array.from(answers.current.values()),
        showLoader: true,
      }).unwrap();

      // The result takes the session's place, as it does after cards: left
      // underneath, the finished session was where "again" and every way back
      // from the result ended up.
      navigation.replace('MathResult', { result: result.data, category });
    } catch {
      // The result did not go through, so the session is kept: the screen stays
      // and the button will work again.
    }
  }, [index, questions.length, sessionId, finishSession, navigation, category]);

  const onSubmit = useCallback(() => {
    if (!question || value === '') return;

    const answered = Number(value);
    recordAttempt(answered);

    if (answered === question.correctValue) {
      setFeedback('correct');
      // Sound comes with the colour, not instead of it: a child playing with the
      // sound off and a child not looking at the screen learn about the answer
      // the same way.
      playCorrect();
      // A short pause so the child sees the answer was accepted, then it moves
      // on by itself.
      setTimeout(goNext, 700);
      return;
    }

    setFeedback('wrong');
    playWrong();
    setValue('');

    // The problem stays the same: only then does "try again" make sense.
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [question, value, recordAttempt, goNext, shake, playCorrect, playWrong]);

  const onSkip = useCallback(() => {
    // Leaving is always possible, even without solving. A skip differs from a
    // mistake: it tells the parent "too hard", not "does not know".
    if (question && !answers.current.has(question.questionId)) {
      answers.current.set(question.questionId, {
        questionId: question.questionId,
        value: null,
        attempts: 0,
      });
    }
    goNext();
  }, [question, goNext]);

  const onKey = useCallback(
    (key: string) => {
      setFeedback('idle');
      if (key === 'backspace') {
        setValue(prev => prev.slice(0, -1));
        return;
      }
      setValue(prev => (prev.length >= maxDigits ? prev : prev + key));
    },
    [maxDigits],
  );

  if (!question) {
    return (
      <BackgroundWrapper includesSafeArea>
        <Loader isLoading />
      </BackgroundWrapper>
    );
  }

  const progress: `${number}%` = `${((index + 1) / questions.length) * 100}%`;

  return (
    <BackgroundWrapper includesSafeArea>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.topButton} onPress={() => navigation.goBack()}>
            <Icon name={'XCloseIcon'} width={30} height={30} color={'icon_secondary'} />
          </Pressable>

          <View style={styles.progressBox}>
            <Typography type="bodySBold" textColor="text_tertiary" textStyles={styles.progressLabel}>
              {t('math_progress', { current: index + 1, total: questions.length })}
            </Typography>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: progress }]} />
            </View>
          </View>

          <Pressable style={styles.topButton} onPress={onSkip}>
            <Icon name={'ChevronRight'} width={32} height={32} color={'accent_active'} />
          </Pressable>
        </View>

        <Animated.View
          style={[
            styles.formulaCard,
            { transform: [{ translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] }) }] },
          ]}
        >
          <Typography type="titleXL" textStyles={[styles.operand, scaled(FORMULA.operand, 82)]}>{left}</Typography>
          <Typography type="titleXL" textColor="accent_active" textStyles={[styles.operator, scaled(FORMULA.operator, 66)]}>{operator}</Typography>
          <Typography type="titleXL" textStyles={[styles.operand, scaled(FORMULA.operand, 82)]}>{right}</Typography>
          <Typography type="titleXL" textColor="text_tertiary" textStyles={[styles.equals, scaled(FORMULA.equals, 62)]}>=</Typography>
          <Typography
            type="titleXL"
            textColor={feedback === 'correct' ? 'text_positive' : 'controls_inactive'}
            textStyles={[styles.operand, scaled(FORMULA.operand, 82)]}
          >
            {answerText}
          </Typography>
        </Animated.View>

        <View
          style={[
            styles.answerBox,
            feedback === 'wrong' && styles.answerBoxWrong,
            feedback === 'correct' && styles.answerBoxCorrect,
          ]}
        >
          <Typography type="titleXL" textStyles={styles.answerText}>{value}</Typography>
          {value.length < maxDigits && <View style={styles.caret} />}
        </View>

        <View style={styles.pad}>
          {KEYS.map((key, keyIndex) => {
            if (key === '') {
              return <View key={`empty-${keyIndex}`} style={[styles.key, styles.keyEmpty]} />;
            }

            return (
              <Pressable
                key={key}
                style={[styles.key, key === 'backspace' && styles.keyBackspace]}
                onPress={() => onKey(key)}
              >
                {key === 'backspace' ? (
                  <Icon name={'BackspaceIcon'} width={30} height={30} color={'icon_secondary'} />
                ) : (
                  <Typography type="titleXL" textStyles={styles.keyText}>{key}</Typography>
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[styles.submit, value === '' && styles.submitDisabled]}
          disabled={value === ''}
          onPress={onSubmit}
        >
          <Typography type="titleXL" textColor="text_inverted" textStyles={styles.submitText}>
            {t('math_done')}
          </Typography>
        </Pressable>
      </View>
    </BackgroundWrapper>
  );
};

export default MathCard;
