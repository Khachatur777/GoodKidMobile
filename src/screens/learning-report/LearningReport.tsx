import { FC, useContext, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { IReportCategory } from 'models';
import { useGetLearningReportQuery } from 'rtk';
import { learningReportStyles } from './learning-report-styles.ts';

const MATH_LABELS: Record<string, string> = {
  'math.addition': 'math_addition',
  'math.subtraction': 'math_subtraction',
  'math.multiplication': 'math_multiplication',
  'math.division': 'math_division',
};

export interface LearningReportProps {
  route: RouteProp<{ params: { childId: string; childName?: string } }, 'params'>;
}

const LearningReport: FC<LearningReportProps> = ({ route }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => learningReportStyles(color), [color]);
  const { childId } = route.params;

  const { data, isFetching } = useGetLearningReportQuery({ childId, showModal: true });

  const report = data?.data;
  const categories = report?.categories || [];

  const totals = categories.reduce(
    (acc, row) => ({
      answered: acc.answered + row.answered,
      correct: acc.correct + row.correctFirstTry,
      skipped: acc.skipped + row.skipped,
    }),
    { answered: 0, correct: 0, skipped: 0 },
  );

  const categoryName = (row: IReportCategory) => {
    if (MATH_LABELS[row.categoryKey]) return t(MATH_LABELS[row.categoryKey]);
    // Без ключа перевода показываем прочерк, а не id: шестнадцатеричная строка
    // ничего родителю не говорит.
    return row.nameKey ? t(row.nameKey) : t('report_category_unknown');
  };

  if (isFetching && !report) {
    return (
      <BackgroundWrapper>
        <Loader isLoading />
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <View style={styles.summaryCell}>
            <Typography type="bodyS" textColor="text_tertiary">{t('report_stars')}</Typography>
            <View style={styles.summaryValue}>
              <Icon name={'StarIcon'} width={20} height={20} color={'accent_active'} />
              <Typography type="title2">{String(report?.child?.stars?.total ?? 0)}</Typography>
            </View>
          </View>

          <View style={styles.summaryCell}>
            <Typography type="bodyS" textColor="text_tertiary">{t('report_solved')}</Typography>
            <Typography type="title2">{String(totals.answered)}</Typography>
          </View>

          <View style={styles.summaryCell}>
            <Typography type="bodyS" textColor="text_tertiary">{t('report_first_try')}</Typography>
            <Typography type="title2">
              {totals.answered > 0
                ? `${Math.round((totals.correct / totals.answered) * 100)}%`
                : '—'}
            </Typography>
          </View>
        </View>

        {categories.length === 0 ? (
          <View style={styles.empty}>
            <Icon name={'PuzzleIcon'} width={52} height={52} color={'icon_tertiary'} />
            <Typography type="title3" alignment="center">{t('report_empty_title')}</Typography>
            <Typography type="bodyS" textColor="text_tertiary" alignment="center">
              {t('report_empty_hint')}
            </Typography>
          </View>
        ) : (
          categories.map(row => {
            const ratio = row.answered > 0 ? row.correctFirstTry / row.answered : 0;

            return (
              <View key={row.categoryKey} style={styles.card}>
                <View style={styles.cardHead}>
                  <Typography type="bodyBold" textStyles={styles.cardTitle}>
                    {categoryName(row)}
                  </Typography>
                  <View style={styles.starsRow}>
                    <Icon name={'StarIcon'} width={16} height={16} color={'accent_active'} />
                    <Typography type="bodySBold" textColor="text_tertiary">
                      {String(row.starsEarned)}
                    </Typography>
                  </View>
                </View>

                {row.answered > 0 && (
                  <>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
                    </View>

                    <View style={styles.stats}>
                      <View style={styles.stat}>
                        <Typography type="caption" textColor="text_tertiary">
                          {t('report_first_try')}
                        </Typography>
                        <Typography type="bodySBold">
                          {t('math_result_of', { correct: row.correctFirstTry, total: row.answered })}
                        </Typography>
                      </View>

                      <View style={styles.stat}>
                        <Typography type="caption" textColor="text_tertiary">
                          {t('report_attempts')}
                        </Typography>
                        <Typography type="bodySBold">{String(row.averageAttempts)}</Typography>
                      </View>
                    </View>
                  </>
                )}

                {row.skipped > 0 && (
                  <View style={styles.skippedBadge}>
                    <Icon name={'LightbulbIcon'} width={18} height={18} color={'accent_warning'} />
                    <Typography type="bodyS" textColor="text_secondary">
                      {t('report_skipped', { count: row.skipped })}
                    </Typography>
                  </View>
                )}
              </View>
            );
          })
        )}

        {totals.skipped > 0 && (
          <View style={styles.hint}>
            <Icon name={'InfoIcon'} width={20} height={20} color={'accent_active'} />
            <Typography type="bodyS" textColor="text_secondary" textStyles={styles.cardTitle}>
              {t('report_skipped_hint')}
            </Typography>
          </View>
        )}
      </ScrollView>
    </BackgroundWrapper>
  );
};

export default LearningReport;
