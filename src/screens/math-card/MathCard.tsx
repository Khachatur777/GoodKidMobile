import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Pressable, View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { IMathCategory, IMathQuestion, ISubmittedAnswer } from 'models';
import { useFinishSessionMutation, useStartMathSessionMutation } from 'rtk';
import { mathCardStyles } from './math-card-styles.ts';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

type Feedback = 'idle' | 'correct' | 'wrong';

export interface MathCardProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { category: IMathCategory } }, 'params'>;
}

const MathCard: FC<MathCardProps> = ({ navigation, route }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => mathCardStyles(color), [color]);
  const category = route.params?.category;

  const [startSession] = useStartMathSessionMutation();
  const [finishSession] = useFinishSessionMutation();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<IMathQuestion[]>([]);
  const [maxDigits, setMaxDigits] = useState(3);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');

  // Ответы копятся здесь, а не на сервере: сессия уходит одним запросом в
  // конце, поэтому обрыв связи посреди неё не стоит ребёнку заработанного.
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
        setMaxDigits(response.data.answerMaxDigits);
      })
      .catch(error => {
        if (cancelled) return;
        // Сессии принадлежат ребёнку: звёзды и прогресс — его. Родителю,
        // открывшему раздел, надо это сказать, а не оставить пустой экран.
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

    // Просмотр родителя: сессии нет, засчитывать и награждать нечего.
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

      navigation.navigate('MathResult', { result: result.data, category });
    } catch {
      // Итог не ушёл — сессию не теряем: экран остаётся, кнопка сработает снова.
    }
  }, [index, questions.length, sessionId, finishSession, navigation, category]);

  const onSubmit = useCallback(() => {
    if (!question || value === '') return;

    const answered = Number(value);
    recordAttempt(answered);

    if (answered === question.correctValue) {
      setFeedback('correct');
      // Короткая пауза, чтобы ребёнок увидел, что ответ принят, и переход сам.
      setTimeout(goNext, 700);
      return;
    }

    setFeedback('wrong');
    setValue('');

    // Пример остаётся тем же: «попробовать ещё раз» только тогда и имеет смысл.
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [question, value, recordAttempt, goNext, shake]);

  const onSkip = useCallback(() => {
    // Уйти можно всегда, даже не решив. Пропуск отличается от ошибки: он
    // говорит родителю «слишком сложно», а не «не знает».
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
        <Loader />
      </BackgroundWrapper>
    );
  }

  const progress = `${(index + 1) / questions.length * 100}%`;

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
          <Typography type="titleXL" textStyles={styles.operand}>{left}</Typography>
          <Typography type="titleXL" textColor="accent_active" textStyles={styles.operator}>{operator}</Typography>
          <Typography type="titleXL" textStyles={styles.operand}>{right}</Typography>
          <Typography type="titleXL" textColor="text_tertiary" textStyles={styles.equals}>=</Typography>
          <Typography
            type="titleXL"
            textColor={feedback === 'correct' ? 'text_positive' : 'controls_inactive'}
            textStyles={styles.operand}
          >
            {feedback === 'correct' ? String(question.correctValue) : '?'}
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
