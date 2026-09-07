import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Modal, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { IReportCategory, IReportQuestion } from 'models';
import { useGetLearningReportQuery, useGetReportQuestionsQuery } from 'rtk';
import { learningReportStyles } from './learning-report-styles.ts';

// Знак операции в шапке модала — та же плитка, что на экране настроек
// математики: родитель узнаёт раздел раньше, чем прочтёт заголовок.
const SIGNS: Record<string, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

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

  const questions = useMemo(
    () => questionsData?.data?.questions ?? [],
    [questionsData],
  );
  const questionDays = questionsData?.data?.days ?? 0;

  // Три числа вместо десяти одинаковых строк: главное — сколько пропущено, и
  // это должно читаться сразу, а не пересчитываться глазами.
  const tally = useMemo(() => {
    const first = questions.filter(item => item.status === 'correct' && item.firstTry).length;
    const retry = questions.filter(item => item.status === 'correct' && !item.firstTry).length;

    return { first, retry, missed: questions.length - first - retry };
  }, [questions]);

  // Совет появляется, только когда есть о чём советовать: половина задач мимо —
  // это уже не «бывает», а «слишком сложно».
  const tooHard = questions.length > 0 && tally.missed * 2 >= questions.length;

  // Дни считаются в местном времени родителя, как и на странице ребёнка.
  const dayLabel = useCallback(
    (iso: string) => {
      const startOfDay = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const days = Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86400000);

      if (days === 0) return t('child_activity_today');
      if (days === 1) return t('child_activity_yesterday');

      return new Date(iso).toLocaleDateString([], { day: 'numeric', month: 'long' });
    },
    [t],
  );

  // Задачи одного дня идут одной группой: «сегодня пропустил половину» — это
  // другой разговор, чем «пропустил пять раз за неделю».
  const grouped = useMemo(() => {
    const rows: (
      | { kind: 'day'; key: string; label: string }
      | { kind: 'row'; key: string; question: IReportQuestion }
    )[] = [];
    let current: string | null = null;

    questions.forEach((question, index) => {
      const label = dayLabel(question.at);

      if (label !== current) {
        rows.push({ kind: 'day', key: `day-${index}`, label });
        current = label;
      }

      rows.push({ kind: 'row', key: `question-${index}`, question });
    });

    return rows;
  }, [questions, dayLabel]);

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
        scrollable
      >
        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <View style={styles.sheetGlyph}>
              <Text style={styles.sheetGlyphText}>{operation ? SIGNS[operation] : ''}</Text>
            </View>

            <View style={styles.sheetTitle}>
              <Typography type="title3">{operation ? t(`math_${operation}`) : ''}</Typography>

              {/* Период называем прямо: числа на карточке — за всё время, а
                  здесь последние задачи за те же дни, что показывает
                  «Активность». Без этой строки родитель решит, что счётчики
                  врут. */}
              <Typography type="bodyS" textColor="text_tertiary">
                {t('report_questions_period', {
                  count: questions.length,
                  days: questionDays,
                })}
              </Typography>
            </View>
          </View>

          {questions.length > 0 && (
            <View style={styles.tally}>
              <View style={[styles.tallyCell, styles.tallyGood]}>
                <Typography type="title3" textColor="text_positive">
                  {String(tally.first)}
                </Typography>
                <Typography type="captionBold" textColor="text_positive">
                  {t('report_question_first_try')}
                </Typography>
              </View>

              <View style={[styles.tallyCell, styles.tallyRetry]}>
                <Typography type="title3" textColor="accent_warning">
                  {String(tally.retry)}
                </Typography>
                <Typography type="captionBold" textColor="accent_warning">
                  {t('report_question_second_try')}
                </Typography>
              </View>

              <View style={[styles.tallyCell, styles.tallyMissed]}>
                <Typography type="title3" textColor="accent_active">
                  {String(tally.missed)}
                </Typography>
                <Typography type="captionBold" textColor="accent_active">
                  {t('report_question_skipped')}
                </Typography>
              </View>
            </View>
          )}

          {tooHard && (
            <View style={styles.sheetHint}>
              <Icon name={'LightbulbIcon'} width={20} height={20} color={'accent_active'} />
              <Typography type="bodyS" textColor="text_secondary" textStyles={styles.cardTitle}>
                {t('report_questions_hint_hard')}
              </Typography>
            </View>
          )}

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
              {grouped.map((item, index) => {
                if (item.kind === 'day') {
                  return (
                    <View key={item.key}>
                      {index > 0 && <View style={styles.questionDivider} />}
                      <Typography
                        type="captionBold"
                        textColor="text_tertiary"
                        textStyles={styles.dayLabel}
                      >
                        {item.label.toUpperCase()}
                      </Typography>
                    </View>
                  );
                }

                const question = item.question;
                const solved = question.status === 'correct';
                // Пропущенный — не ошибка: ребёнок его не решал. Своя метка, не
                // красная, но в списке стоит на своём месте.
                const untouched = question.status === 'unanswered';

                return (
                  <View key={item.key}>
                    {index > 0 && <View style={styles.questionDivider} />}

                    <View style={styles.question}>
                      {solved && question.firstTry ? (
                        <View style={[styles.questionBadge, styles.badgeGood]}>
                          <Icon name={'CheckMark'} width={18} height={18} color={'text_positive'} />
                        </View>
                      ) : solved ? (
                        // В метке само число попыток: столбик цифр слева читается
                        // быстрее, чем подписи справа.
                        <View style={[styles.questionBadge, styles.badgeRetry]}>
                          <Typography type="captionBold" textColor="accent_warning">
                            {String(question.attempts)}
                          </Typography>
                        </View>
                      ) : (
                        <View style={[styles.questionBadge, styles.badgeMissed]}>
                          <Icon name={'RefreshIcon'} width={17} height={17} color={'accent_active'} />
                        </View>
                      )}

                      <Typography
                        type="bodyBold"
                        textStyles={styles.questionText}
                        textColor={solved ? 'text_primary' : 'text_secondary'}
                      >
                        {question.expression} = {question.correctValue}
                      </Typography>

                      {solved && question.firstTry ? (
                        <Typography type="captionBold" textColor="text_positive">
                          {t('report_question_first_try')}
                        </Typography>
                      ) : solved ? (
                        <Typography type="captionBold" textColor="accent_warning">
                          {question.attempts === 2
                            ? t('report_question_second_try')
                            : t('report_question_attempts', { count: question.attempts })}
                        </Typography>
                      ) : (
                        <Typography type="captionBold" textColor="accent_active">
                          {untouched
                            ? t('report_question_skipped')
                            : question.value === null
                              ? t('report_question_unsolved')
                              : t('report_question_answered', { value: question.value })}
                        </Typography>
                      )}
                    </View>
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
