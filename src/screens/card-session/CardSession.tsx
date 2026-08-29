import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import {
  ICardAnswer,
  ICardCategory,
  ILearningCard,
  ILocalized,
  ISubmittedAnswer,
} from 'models';
import {
  useCompleteCategoryMutation,
  useFinishSessionMutation,
  useStartCardSessionMutation,
} from 'rtk';
import { getFileUri } from 'utils';
import { useAudioPlayer } from 'hooks/useAudioPlayer';
import { cardSessionStyles } from './card-session-styles.ts';

type Lang = 'ru' | 'en' | 'hy';

const resolveLang = (): Lang => {
  const code = (i18n.language || 'en').toLowerCase();
  if (code.startsWith('ru')) return 'ru';
  if (code.startsWith('hy')) return 'hy';
  return 'en';
};

const localized = (value: ILocalized | undefined, lang: Lang) =>
  value?.[lang] || value?.en || '';

export interface CardSessionProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { category: ICardCategory } }, 'params'>;
}

const CardSession: FC<CardSessionProps> = ({ navigation, route }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => cardSessionStyles(color), [color]);
  const category = route.params?.category;
  const lang = useMemo(resolveLang, []);

  const { play, playing } = useAudioPlayer();
  const [startSession] = useStartCardSessionMutation();
  const [finishSession] = useFinishSessionMutation();
  const [completeCategory] = useCompleteCategoryMutation();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cards, setCards] = useState<ILearningCard[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const answers = useRef<Map<string, ISubmittedAnswer>>(new Map());

  useEffect(() => {
    let cancelled = false;

    startSession({ categoryId: category.categoryKey, showModal: true })
      .unwrap()
      .then(response => {
        if (cancelled) return;
        setSessionId(response.data.sessionId);
        setCards(response.data.cards);
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
  }, [category.categoryKey, startSession]);

  const card = cards[index];

  const audioPath = card?.type === 'learn'
    ? card?.audio?.[lang]?.path
    : card?.questionAudio?.[lang]?.path || card?.audio?.[lang]?.path;

  const speak = useCallback(() => {
    if (audioPath) play(getFileUri(audioPath));
  }, [audioPath, play]);

  // Вопрос звучит сам при открытии карточки: ребёнок, который не читает,
  // иначе не узнает, что от него хотят. Кнопка рядом — для тех, кто прослушал.
  useEffect(() => {
    speak();
  }, [speak]);

  const goNext = useCallback(async () => {
    setPicked(null);

    if (index + 1 < cards.length) {
      setIndex(index + 1);
      return;
    }

    // Просмотр родителя: показывать экран результата не за что, звёзд нет.
    if (!sessionId) {
      navigation.goBack();
      return;
    }

    const answered = Array.from(answers.current.values());

    try {
      if (answered.length > 0 && sessionId) {
        const result = await finishSession({
          sessionId,
          answers: answered,
          showLoader: true,
        }).unwrap();
        navigation.replace('MathResult', { result: result.data, category: null });
        return;
      }

      // Категория без заданий: её проходят глазами, и награда за неё —
      // фиксированная и только за первый раз.
      const result = await completeCategory({
        categoryId: category.categoryKey,
        cardIds: cards.map(item => item.id),
        showLoader: true,
      }).unwrap();

      navigation.replace('MathResult', {
        result: {
          stars: result.data.stars,
          perfect: false,
          correctFirstTry: cards.length,
          totalQuestions: cards.length,
          totalStars: result.data.totalStars ?? null,
          starsBalance: result.data.starsBalance ?? null,
          alreadyFinished: result.data.alreadyRewarded,
          viewOnly: true,
        },
        category: null,
      });
    } catch {
      // Итог не ушёл — экран остаётся, кнопка сработает снова.
    }
  }, [index, cards, sessionId, finishSession, completeCategory, category.categoryKey, navigation]);

  const onPick = useCallback(
    (answer: ICardAnswer) => {
      if (!card) return;

      const previous = answers.current.get(card.id);
      answers.current.set(card.id, {
        questionId: card.id,
        answerId: answer.id,
        attempts: (previous?.attempts || 0) + 1,
      });

      setPicked(answer.id);

      // Верный ответ уводит дальше сам; неверный оставляет карточку на месте,
      // чтобы попробовать ещё раз на том же вопросе.
      if (answer.isCorrect) {
        setTimeout(goNext, 700);
      }
    },
    [card, goNext],
  );

  const onSkip = useCallback(() => {
    if (card && !answers.current.has(card.id) && (card.answers || []).length > 0) {
      answers.current.set(card.id, { questionId: card.id, answerId: null, attempts: 0 });
    }
    goNext();
  }, [card, goNext]);

  if (!card) {
    return (
      <BackgroundWrapper includesSafeArea>
        <Loader />
      </BackgroundWrapper>
    );
  }

  const hasOptions = (card.answers || []).length > 0;
  const questionText = hasOptions
    ? localized(card.question, lang)
    : localized(card.title, lang);

  return (
    <BackgroundWrapper includesSafeArea>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable style={styles.topButton} onPress={() => navigation.goBack()}>
            <Icon name={'XCloseIcon'} width={30} height={30} color={'icon_secondary'} />
          </Pressable>

          <View style={styles.progressBox}>
            <Typography type="bodySBold" textColor="text_tertiary" textStyles={styles.progressLabel}>
              {t('math_progress', { current: index + 1, total: cards.length })}
            </Typography>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${((index + 1) / cards.length) * 100}%` }]} />
            </View>
          </View>

          <Pressable style={styles.topButton} onPress={onSkip}>
            <Icon name={'ChevronRight'} width={32} height={32} color={'accent_active'} />
          </Pressable>
        </View>

        <View style={styles.stage}>
          <View style={styles.imageBox}>
            {card.type === 'count' && card.visual?.repeat ? (
              <View style={styles.objects}>
                {Array.from({ length: card.visual.repeat }).map((_, i) => (
                  <Text key={i} style={styles.object}>{card.visual?.emoji || '🍎'}</Text>
                ))}
              </View>
            ) : card.images?.[0]?.path ? (
              <Image
                source={{ uri: getFileUri(card.images[0].path) }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : null}
          </View>

          <View style={styles.questionRow}>
            <Typography type="title3" textStyles={styles.questionText}>
              {questionText}
            </Typography>

            <Pressable
              style={[styles.speaker, playing && styles.speakerActive]}
              onPress={speak}
              disabled={!audioPath}
            >
              <Icon
                name={'SoundIcon'}
                width={30}
                height={30}
                color={playing ? 'icon_inverted' : 'accent_active'}
              />
            </Pressable>
          </View>

          {hasOptions ? (
            <View style={styles.options}>
              {(card.answers || []).map(answer => (
                <Pressable
                  key={answer.id}
                  style={[
                    styles.option,
                    picked === answer.id && (answer.isCorrect ? styles.optionCorrect : styles.optionWrong),
                  ]}
                  onPress={() => onPick(answer)}
                >
                  {answer.emoji ? (
                    <Text style={styles.optionEmoji}>{answer.emoji}</Text>
                  ) : answer.imagePath ? (
                    <Image source={{ uri: getFileUri(answer.imagePath) }} style={styles.image} />
                  ) : (
                    <Typography type="title2">{localized(answer.label, lang)}</Typography>
                  )}
                </Pressable>
              ))}
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Typography type="bodyS" textColor="text_tertiary" textStyles={styles.description}>
                {localized(card.description, lang)}
              </Typography>
            </ScrollView>
          )}
        </View>

        {!hasOptions && (
          <Pressable style={styles.next} onPress={goNext}>
            <Typography type="titleXL" textColor="text_inverted" textStyles={styles.nextText}>
              {t('cards_next')}
            </Typography>
          </Pressable>
        )}
      </View>
    </BackgroundWrapper>
  );
};

export default CardSession;
