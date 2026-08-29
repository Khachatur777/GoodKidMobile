import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Button, Icon, Loader, TextField, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { IChildMathPreview, IChildMathRule, MathOperation } from 'models';
import {
  useGetChildMathQuery,
  usePreviewChildMathMutation,
  useResetChildMathMutation,
  useUpdateChildMathMutation,
} from 'rtk';
import { childMathStyles } from './child-math-styles.ts';

const SIGNS: Record<MathOperation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

type Draft = { minOperand: string; maxOperand: string; maxResult: string };

const toDraft = (rule: IChildMathRule): Draft => ({
  minOperand: String(rule.minOperand),
  maxOperand: String(rule.maxOperand),
  maxResult: String(rule.maxResult),
});

const toNumbers = (draft: Draft) => ({
  minOperand: Number(draft.minOperand),
  maxOperand: Number(draft.maxOperand),
  maxResult: Number(draft.maxResult),
});

const isComplete = (draft: Draft) =>
  Object.values(draft).every(value => value !== '' && Number.isFinite(Number(value)));

export interface ChildMathSettingsProps {
  route: RouteProp<{ params: { childId: string; childName?: string } }, 'params'>;
}

const ChildMathSettings: FC<ChildMathSettingsProps> = ({ route }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => childMathStyles(color), [color]);
  const { childId } = route.params;

  const { data, isLoading } = useGetChildMathQuery({ childId, showModal: true });
  const [updateMath, { isLoading: saving }] = useUpdateChildMathMutation();
  const [resetMath] = useResetChildMathMutation();
  const [previewMath] = usePreviewChildMathMutation();

  const rules = data?.data;

  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [previews, setPreviews] = useState<Record<string, IChildMathPreview>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (!rules) return;
    setDrafts(Object.fromEntries(rules.map(rule => [rule.operation, toDraft(rule)])));
  }, [rules]);

  // Проверка и примеры считаются на сервере тем же кодом, что потом выдаёт
  // задания ребёнку. Повторять эту логику в приложении значит однажды показать
  // родителю примеры, которых ребёнок не увидит.
  const askPreview = useCallback(
    (operation: string, draft: Draft) => {
      clearTimeout(timers.current[operation]);
      if (!isComplete(draft)) return;

      timers.current[operation] = setTimeout(async () => {
        try {
          const result = await previewMath({
            childId,
            operation,
            ...toNumbers(draft),
            showModal: false,
          }).unwrap();

          setPreviews(prev => ({ ...prev, [operation]: result.data }));
        } catch {
          setPreviews(prev => ({ ...prev, [operation]: { ...prev[operation], ok: false } as IChildMathPreview }));
        }
      }, 400);
    },
    [childId, previewMath],
  );

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  const edit = (operation: string, field: keyof Draft, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    setDrafts(prev => {
      const next = { ...prev[operation], [field]: cleaned };
      askPreview(operation, next);
      return { ...prev, [operation]: next };
    });
  };

  const save = async (rule: IChildMathRule) => {
    const draft = drafts[rule.operation];
    if (!draft || !isComplete(draft)) return;

    try {
      await updateMath({ childId, operation: rule.operation, ...toNumbers(draft), showLoader: true }).unwrap();
      setPreviews(prev => ({ ...prev, [rule.operation]: { ...prev[rule.operation], ok: true } as IChildMathPreview }));
    } catch {
      // Сервер отказал — черновик остаётся на экране, чтобы было что поправить.
    }
  };

  if (isLoading || !rules) {
    return (
      <BackgroundWrapper>
        <Loader isLoading />
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Typography type="bodyS" textColor="text_tertiary" textStyles={styles.intro}>
          {t('child_math_intro')}
        </Typography>

        {rules.map(rule => {
          const draft = drafts[rule.operation];
          const preview = previews[rule.operation];
          if (!draft) return null;

          const changed = JSON.stringify(draft) !== JSON.stringify(toDraft(rule));
          const blocked = preview ? !preview.ok : false;

          return (
            <View key={rule.operation} style={styles.card}>
              <View style={styles.head}>
                <View style={styles.sign}>
                  <Typography type="titleL" textColor="accent_active" textStyles={styles.signText}>
                    {SIGNS[rule.operation]}
                  </Typography>
                </View>

                <View style={styles.headText}>
                  <Typography type="bodyBold">{t(`math_${rule.operation}`)}</Typography>
                  <Typography type="caption" textColor="text_tertiary">
                    {rule.customised ? t('child_math_changed') : t('child_math_default')}
                  </Typography>
                </View>
              </View>

              <View style={styles.fields}>
                <View style={styles.field}>
                  <TextField
                    label={t('child_math_from')}
                    keyboardType="number-pad"
                    value={draft.minOperand}
                    onChangeText={value => edit(rule.operation, 'minOperand', value)}
                  />
                </View>
                <View style={styles.field}>
                  <TextField
                    label={t('child_math_to')}
                    keyboardType="number-pad"
                    value={draft.maxOperand}
                    onChangeText={value => edit(rule.operation, 'maxOperand', value)}
                  />
                </View>
                <View style={styles.field}>
                  <TextField
                    label={t('child_math_max')}
                    keyboardType="number-pad"
                    value={draft.maxResult}
                    onChangeText={value => edit(rule.operation, 'maxResult', value)}
                  />
                </View>
              </View>

              {/* Вычитание ограничено самим диапазоном: максимум на него не влияет */}
              {rule.operation === 'subtraction' && (
                <Typography type="caption" textColor="text_tertiary">
                  {t('child_math_subtraction_note')}
                </Typography>
              )}

              {blocked ? (
                <View style={styles.problem}>
                  <Icon name={'InfoIcon'} width={20} height={20} color={'accent_warning'} />
                  <Typography type="bodyS" textColor="text_secondary" textStyles={styles.problemText}>
                    {t('child_math_too_few', {
                      count: preview?.variants ?? 0,
                      required: preview?.required ?? rule.requiredVariants,
                    })}
                  </Typography>
                </View>
              ) : (
                <View style={styles.examples}>
                  {(preview?.examples?.length ? preview.examples : []).map((example, index) => (
                    <View key={index} style={styles.example}>
                      <Typography type="bodyBold">
                        {example.expression} = {example.correctValue}
                      </Typography>
                    </View>
                  ))}
                </View>
              )}

              {(changed || rule.customised) && (
                <View style={styles.actions}>
                  {changed && (
                    <View style={styles.action}>
                      <Button
                        title={t('child_math_save')}
                        size="small"
                        disabled={blocked || saving}
                        onPress={() => save(rule)}
                      />
                    </View>
                  )}
                  {rule.customised && (
                    <View style={styles.action}>
                      <Button
                        title={t('child_math_reset')}
                        variant="secondary"
                        size="small"
                        onPress={() =>
                          resetMath({ childId, operation: rule.operation, showLoader: true })
                        }
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </BackgroundWrapper>
  );
};

export default ChildMathSettings;
