import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper } from 'molecules';
import { ThemeContext } from 'theme';
import { getFileUri } from 'utils';
import { useAudioPlayer } from 'hooks/useAudioPlayer';
import { useAnswerSounds } from 'hooks';
import {
  useAnswerWordMutation,
  useFinishWordsMutation,
  useStartWordsMutation,
  WordSession,
} from 'rtk/api/language';
import { languageStyles } from './language-styles';
import { useLanguageCopy } from './language-copy';

export default function LanguageSession({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const { color } = useContext(ThemeContext),
    copy = useLanguageCopy();
  const styles = useMemo(() => languageStyles(color), [color]);
  const [start] = useStartWordsMutation(),
    [answer] = useAnswerWordMutation(),
    [finish] = useFinishWordsMutation();
  const [session, setSession] = useState<WordSession>();
  const [index, setIndex] = useState(0),
    [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [wrong, setWrong] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [empty, setEmpty] = useState(false);
  const inFlight = useRef(false);
  const failedAction = useRef<'load' | 'answer' | 'finish'>('load');
  // Keep the exact request when a response is lost; replay cannot count a second attempt.
  const pending = useRef<{
    requestId: string;
    tileIds: string[];
    skip: boolean;
  } | null>(null);
  const { play, stop } = useAudioPlayer();
  const { playCorrect, playWrong } = useAnswerSounds();
  const question = session?.questions[index];
  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError('');
    setEmpty(false);
    failedAction.current = 'load';
    try {
      const r = await start().unwrap();
      setSession(r.data);
      const next = r.data.questions.findIndex(q => q.status === 'unanswered');
      setIndex(next < 0 ? r.data.questions.length - 1 : next);
    } catch (e: any) {
      setEmpty(e?.data?.message === 'language.empty');
      setError(
        e?.data?.message === 'language.empty'
          ? copy.empty
          : e?.data?.message === 'child_only'
          ? copy.parent
          : copy.offline,
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, [start, copy.empty, copy.parent, copy.offline]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setSelected([]);
    setWrong(false);
    setImageFailed(false);
    pending.current = null;
    stop();
  }, [question?.id, stop]);
  const complete = async () => {
    if (!session || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError('');
    stop();
    try {
      setSession((await finish(session.sessionId).unwrap()).data);
    } catch {
      failedAction.current = 'finish';
      setError(copy.offline);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  const submit = async (skip = false) => {
    if (!session || !question || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError('');
    if (!pending.current)
      pending.current = {
        requestId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        tileIds: selected,
        skip,
      };
    try {
      const updated = (
        await answer({
          sessionId: session.sessionId,
          questionId: question.id,
          ...pending.current,
        }).unwrap()
      ).data;
      pending.current = null;
      setSession(updated);
      const q = updated.questions[index];
      setWrong(q.status === 'unanswered');
      if (q.status === 'correct') playCorrect();
      else if (q.status === 'unanswered') playWrong();
    } catch {
      failedAction.current = 'answer';
      setError(copy.offline);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  };
  const askExit = () =>
    session?.status === 'active'
      ? Alert.alert(copy.exit, copy.exitNote, [
          { text: copy.cancel, style: 'cancel' },
          { text: copy.finish, onPress: complete },
        ])
      : navigation.goBack();
  return (
    <BackgroundWrapper includesSafeArea>
      <View style={styles.screen}>
        <View style={styles.top}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.back}
            onPress={askExit}
            disabled={busy}
            style={styles.secondary}
          >
            <Text style={styles.title}>×</Text>
          </Pressable>
          {session && (
            <View style={styles.track}>
              <View
                style={[
                  styles.progress,
                  {
                    width: `${
                      session
                        ? ((index + 1) / session.questions.length) * 100
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
          )}
          <Text style={styles.muted}>
            {session ? `${index + 1}/${session.questions.length}` : ''}
          </Text>
        </View>
        {busy && <ActivityIndicator color={color('accent_active')} />}
        <ScrollView contentContainerStyle={styles.content}>
          {error ? (
            <View style={styles.card}>
              <Text style={styles.title}>{copy.title}</Text>
              <Text
                accessibilityRole={empty ? undefined : 'alert'}
                style={styles.error}
              >
                {error}
              </Text>
              {empty && (
                <Pressable
                  accessibilityRole="button"
                  style={styles.button}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.buttonText}>{copy.back}</Text>
                </Pressable>
              )}
              <Pressable
                accessibilityRole="button"
                style={styles.secondary}
                disabled={busy}
                onPress={() =>
                  failedAction.current === 'finish'
                    ? complete()
                    : failedAction.current === 'answer'
                    ? submit()
                    : load()
                }
              >
                <Text style={styles.text}>{copy.retry}</Text>
              </Pressable>
            </View>
          ) : null}
          {session?.status === 'finished' ? (
            <View style={styles.card}>
              <Text style={styles.title}>{copy.result}</Text>
              <Text style={[styles.title, styles.resultStars]}>
                ★ {session.stars}
              </Text>
              <Text style={styles.text}>{copy.stars}</Text>
              <Text style={styles.muted}>
                {copy.first}: {session.correctFirstTry}/{session.totalQuestions}
              </Text>
              <Pressable
                style={styles.button}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>{copy.back}</Text>
              </Pressable>
            </View>
          ) : (
            question && (
              <>
                {imageFailed ? (
                  <Text style={styles.muted}>{copy.imageError}</Text>
                ) : (
                  <Image
                    source={{ uri: getFileUri(question.image) }}
                    resizeMode="contain"
                    style={styles.image}
                    onError={() => setImageFailed(true)}
                    accessible={false}
                  />
                )}
                <View style={styles.top}>
                  <Text style={styles.title}>{copy.title}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={copy.play}
                    onPress={() => play(getFileUri(question.audio))}
                    style={styles.secondary}
                  >
                    <Text style={styles.text}>♫ {copy.play}</Text>
                  </Pressable>
                </View>
                <View style={styles.tiles}>
                  {Array.from({ length: question.length }, (_, i) => (
                    <Pressable
                      key={i}
                      accessibilityLabel={copy.remove}
                      disabled={
                        busy ||
                        !!pending.current ||
                        question.status !== 'unanswered'
                      }
                      onPress={() =>
                        setSelected(s => s.filter((tileId, n) => n !== i))
                      }
                      style={[styles.tile, styles.selected]}
                    >
                      <Text style={styles.letter}>
                        {question.tiles.find(t => t.id === selected[i])
                          ?.letter || '·'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                {question.status !== 'unanswered' ? (
                  <View style={styles.card}>
                    <Text style={styles.title}>
                      {question.status === 'correct'
                        ? copy.correct
                        : copy.skipped}
                    </Text>
                    <Text style={styles.title}>{question.word}</Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.tiles}>
                      {question.tiles.map(tile => (
                        <Pressable
                          key={tile.id}
                          accessibilityRole="button"
                          accessibilityLabel={tile.letter}
                          disabled={
                            busy ||
                            !!pending.current ||
                            selected.includes(tile.id) ||
                            selected.length >= question.length
                          }
                          onPress={() => {
                            setSelected(s => [...s, tile.id]);
                            setWrong(false);
                          }}
                          style={[
                            styles.tile,
                            selected.includes(tile.id) && styles.disabled,
                          ]}
                        >
                          <Text style={styles.letter}>{tile.letter}</Text>
                        </Pressable>
                      ))}
                    </View>
                    <Pressable
                      disabled={busy || !!pending.current}
                      style={styles.secondary}
                      onPress={() => setSelected(s => s.slice(0, -1))}
                    >
                      <Text style={styles.text}>⌫ {copy.remove}</Text>
                    </Pressable>
                    {wrong && (
                      <Text accessibilityRole="alert" style={styles.error}>
                        {copy.wrong}
                      </Text>
                    )}
                  </>
                )}
                <Pressable
                  disabled={
                    busy ||
                    (question.status === 'unanswered' &&
                      selected.length !== question.length)
                  }
                  style={[
                    styles.button,
                    (busy ||
                      (question.status === 'unanswered' &&
                        selected.length !== question.length)) &&
                      styles.disabled,
                  ]}
                  onPress={() =>
                    question.status === 'unanswered'
                      ? submit()
                      : index + 1 < session.questions.length
                      ? setIndex(index + 1)
                      : complete()
                  }
                >
                  <Text style={styles.buttonText}>
                    {question.status === 'unanswered'
                      ? copy.done
                      : index + 1 < session.questions.length
                      ? copy.next
                      : copy.finish}
                  </Text>
                </Pressable>
                {question.status === 'unanswered' && (
                  <Pressable
                    disabled={busy || !!pending.current}
                    style={styles.secondary}
                    onPress={() => submit(true)}
                  >
                    <Text style={styles.muted}>{copy.skip}</Text>
                  </Pressable>
                )}
              </>
            )
          )}
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
}
