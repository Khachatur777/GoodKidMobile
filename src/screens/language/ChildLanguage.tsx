import { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { BackgroundWrapper } from 'molecules';
import { ThemeContext } from 'theme';
import {
  Language,
  WordReport,
  useGetChildLanguageQuery,
  useGetWordsReportQuery,
  useSaveChildLanguageMutation,
} from 'rtk/api/language';
import { useLanguageCopy } from './language-copy';
import { languageStyles } from './language-styles';
const names = { en: 'English', ru: 'Русский', hy: 'Հայերեն' };
export default function ChildLanguage({
  route,
}: {
  route: RouteProp<{ params: { childId: string } }, 'params'>;
}) {
  const { childId } = route.params;
  const { color } = useContext(ThemeContext),
    copy = useLanguageCopy(),
    styles = useMemo(() => languageStyles(color), [color]);
  const {
    data,
    isLoading,
    error: loadError,
    refetch,
  } = useGetChildLanguageQuery(childId, { refetchOnMountOrArgChange: true });
  const [save, { isLoading: saving }] = useSaveChildLanguageMutation();
  const [language, setLanguage] = useState<Language>('en'),
    [min, setMin] = useState('4'),
    [max, setMax] = useState('6');
  const [message, setMessage] = useState(''),
    [skip, setSkip] = useState(0),
    [rows, setRows] = useState<WordReport['rows']>([]);
  const {
    data: report,
    isFetching: reportLoading,
    error: reportError,
    refetch: reloadReport,
  } = useGetWordsReportQuery(
    { childId, skip },
    { refetchOnMountOrArgChange: true },
  );
  useEffect(() => {
    if (data) {
      setLanguage(data.data.language);
      setMin(String(data.data.minLength));
      setMax(String(data.data.maxLength));
    }
  }, [data]);
  useEffect(() => {
    if (report)
      setRows(prev =>
        skip === 0
          ? report.data.rows
          : [
              ...new Map(
                [...prev, ...report.data.rows].map(r => [r.id, r]),
              ).values(),
            ],
      );
  }, [report, skip]);
  const submit = async () => {
    const a = Number(min),
      b = Number(max);
    if (!/^\d+$/.test(min) || !/^\d+$/.test(max) || a < 2 || b > 12 || a > b) {
      setMessage(copy.invalid);
      return;
    }
    try {
      await save({ childId, language, minLength: a, maxLength: b }).unwrap();
      setMessage(copy.saved);
    } catch {
      setMessage(copy.offline);
    }
  };
  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.parentContent}>
        {isLoading && <ActivityIndicator />}
        {loadError ? (
          <Pressable onPress={refetch}>
            <Text style={styles.error}>
              {copy.offline} · {copy.retry}
            </Text>
          </Pressable>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>{copy.settings}</Text>
            <View style={styles.tiles}>
              {(Object.keys(names) as Language[]).map(id => (
                <Pressable
                  key={id}
                  style={[styles.tile, language === id && styles.selected]}
                  onPress={() => setLanguage(id)}
                >
                  <Text style={styles.text}>{names[id]}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.title}>{copy.range}</Text>
            <View style={styles.top}>
              <View>
                <Text style={styles.muted}>{copy.from}</Text>
                <TextInput
                  accessibilityLabel={copy.from}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={min}
                  onChangeText={setMin}
                  style={styles.input}
                />
              </View>
              <View>
                <Text style={styles.muted}>{copy.to}</Text>
                <TextInput
                  accessibilityLabel={copy.to}
                  keyboardType="number-pad"
                  maxLength={2}
                  value={max}
                  onChangeText={setMax}
                  style={styles.input}
                />
              </View>
            </View>
            <Text style={styles.muted}>{copy.pending}</Text>
            <Pressable
              style={[styles.button, saving && styles.disabled]}
              onPress={submit}
              disabled={saving || isLoading}
            >
              <Text style={styles.buttonText}>{copy.save}</Text>
            </Pressable>
            {!!message && (
              <Text accessibilityRole="alert" style={styles.text}>
                {message}
              </Text>
            )}
            <Text style={styles.muted}>
              {copy.available}: {data?.data.available ?? '—'}
            </Text>
          </View>
        )}
        <Text style={styles.title}>{copy.history}</Text>
        {reportError && (
          <Pressable onPress={reloadReport}>
            <Text style={styles.error}>
              {copy.offline} · {copy.retry}
            </Text>
          </Pressable>
        )}
        {!reportLoading && !reportError && !rows.length && (
          <Text style={styles.muted}>{copy.noHistory}</Text>
        )}
        {rows.map(row => (
          <View key={row.id} style={styles.card}>
            <Text style={styles.title}>
              {row.word} · {names[row.language]}
            </Text>
            <Text style={styles.text}>
              {row.status === 'correct' ? copy.solved : copy.notSolved} ·{' '}
              {copy.attempts}: {row.attempts}
            </Text>
            <Text style={styles.muted}>
              {new Date(row.at).toLocaleString()}
            </Text>
          </View>
        ))}
        {reportLoading && <ActivityIndicator />}
        {rows.length < (report?.data.total || 0) && (
          <Pressable
            style={styles.secondary}
            disabled={reportLoading}
            onPress={() => setSkip(skip + 50)}
          >
            <Text style={styles.text}>{copy.more}</Text>
          </Pressable>
        )}
      </ScrollView>
    </BackgroundWrapper>
  );
}
