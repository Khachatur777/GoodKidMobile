import { FC, useContext, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Modal, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { IReportCategory, IReportQuestion } from 'models';
import { useGetLearningReportQuery, useGetReportQuestionsQuery } from 'rtk';
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

  // Какая категория открыта в модале. Ключ операции, а не строка «math.x»:
  // именно его ждёт сервер.
  const [operation, setOperation] = useState<string | null>(null);

  const { data, isFetching } = useGetLearningReportQuery({ childId, showModal: true });

  // Ходим за задачами только когда модал открыт: на самом отчёте они не нужны.
  const { data: questionsData, isFetching: questionsLoading } = useGetReportQuestionsQuery(
    { childId, operation: operation ?? undefined, showModal: false },
    { skip: !operation, refetchOnMountOrArgChange: true },
  );

  const questions = questionsData?.data?.questions ?? [];
  const questionDays = questionsData?.data?.days ?? 0;

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
            // Разбор по задачам есть только у арифметики: у карточек из админки
            // «правильный ответ» — это вариант, а не число, и разговор про них
            // другой.
            const mathOperation =
              row.source === 'math' ? row.categoryKey.replace('math.', '') : null;

            return (
              <Pressable
                key={row.categoryKey}
                style={styles.card}
                disabled={!mathOperation || row.answered === 0}
                onPress={() => setOperation(mathOperation)}
              >
                <View style={styles.cardHead}>
                  <Typography type="bodyBold" textStyles={styles.cardTitle}>
                    {categoryName(row)}
                  </Typography>
                  <View style={styles.starsRow}>
                    <Icon name={'StarIcon'} width={16} height={16} color={'accent_active'} />
                    <Typography type="bodySBold" textColor="text_tertiary">
                      {String(row.starsEarned)}
                    </Typography>

                    {!!mathOperation && row.answered > 0 && (
                      <Icon name={'ChevronRight'} width={18} height={18} color={'icon_tertiary'} />
                    )}
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
              </Pressable>
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

      <Modal
        isVisible={!!operation}
        setIsVisible={() => setOperation(null)}
        type="bottom-sheet"
        showCloseButton
      >
        <View style={styles.sheet}>
          <Typography type="title3">
            {operation ? t(`math_${operation}`) : ''}
          </Typography>

          {/* Период называем прямо: цифры в карточках выше — за всё время, а
              здесь последние задачи за те же дни, что показывает «Активность».
              Без этой строки родитель решит, что счётчики врут. */}
          <Typography type="bodyS" textColor="text_tertiary">
            {t('report_questions_period', { count: questions.length, days: questionDays })}
          </Typography>

          {questionsLoading && questions.length === 0 ? (
            <View style={styles.sheetLoader}>
              <Loader isLoading />
            </View>
          ) : questions.length === 0 ? (
            <Typography type="bodyS" textColor="text_secondary">
              {t('report_questions_empty', { days: questionDays })}
            </Typography>
          ) : (
            <ScrollView
              style={styles.sheetList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetListContent}
            >
              {questions.map((question: IReportQuestion, index: number) => {
                const solved = question.status === 'correct';
                // Пропущенный — не ошибка: ребёнок его не решал. Поэтому
                // приглушённый, а не красный, но в списке стоит на своём месте.
                const untouched = question.status === 'unanswered';

                return (
                  <View key={`${question.expression}-${index}`} style={styles.question}>
                    <Typography
                      type="bodyBold"
                      textStyles={styles.questionText}
                      textColor={
                        solved ? 'text_primary' : untouched ? 'text_tertiary' : 'text_secondary'
                      }
                    >
                      {question.expression} = {question.correctValue}
                    </Typography>

                    {/* Решённое с первой попытки — только галочка: родитель
                        открыл этот список ради того, что пошло не так, и
                        двадцать одинаковых подписей это прячут. */}
                    {solved && question.firstTry ? (
                      <Icon name={'CheckMark'} width={18} height={18} color={'text_positive'} />
                    ) : solved ? (
                      <Typography type="caption" textColor="text_tertiary">
                        {t('report_question_attempts', { count: question.attempts })}
                      </Typography>
                    ) : untouched ? (
                      <Typography type="caption" textColor="text_tertiary">
                        {t('report_question_skipped')}
                      </Typography>
                    ) : (
                      <Typography type="caption" textColor="text_negative">
                        {question.value === null
                          ? t('report_question_unsolved')
                          : t('report_question_answered', { value: question.value })}
                      </Typography>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </Modal>
    </BackgroundWrapper>
  );
};

export default LearningReport;
