import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const learningReportStyles = (color?: IGetColor) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: 18,
      // Хватает, чтобы последняя подсказка не пряталась под таб-баром.
      paddingBottom: 130,
      gap: 14,
    },
    summary: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 6,
    },
    summaryCell: {
      flex: 1,
      padding: 16,
      borderRadius: 22,
      gap: 6,
      backgroundColor: color?.('surface_primary'),
    },
    summaryValue: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    card: {
      padding: 18,
      borderRadius: 24,
      gap: 14,
      backgroundColor: color?.('surface_primary'),
    },
    cardHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    cardTitle: {
      flex: 1,
    },
    starsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    // Полоска верных с первой попытки: родителю нужна доля, а не абсолютное
    // число — «32 из 40» и «32 из 200» это разные новости.
    track: {
      height: 10,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: color?.('surface_stroke'),
    },
    fill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: color?.('text_positive'),
    },
    stats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 14,
    },
    stat: {
      gap: 2,
    },
    // Пропущенные выделены отдельно: это не «ошибся», а «слишком сложно», и
    // именно на них родителю стоит смотреть.
    skippedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: color?.('surface_secondary'),
    },
    // Модал с последними задачами. Высота списка ограничена, а не по
    // содержимому: двадцать строк иначе занимают весь экран и лист некуда тянуть.
    sheet: {
      gap: 14,
      paddingBottom: 8,
    },
    sheetHead: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
      // Место под крестик модала, чтобы заголовок под него не заезжал.
      paddingRight: 34,
    },
    // Знак операции плиткой, как на экране настроек математики.
    sheetGlyph: {
      width: 44,
      height: 44,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_active', 0.12),
    },
    sheetGlyphText: {
      fontSize: 24,
      fontWeight: '900',
      lineHeight: 28,
      color: color?.('accent_active'),
    },
    sheetTitle: {
      flex: 1,
      gap: 3,
    },
    // Сводка: три числа, из которых важно третье.
    tally: {
      flexDirection: 'row',
      gap: 9,
    },
    tallyCell: {
      flex: 1,
      gap: 3,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    tallyGood: {
      backgroundColor: color?.('text_positive', 0.12),
    },
    tallyRetry: {
      backgroundColor: color?.('accent_warning', 0.14),
    },
    // У пропущенных ещё и обводка: это то, ради чего список открывают.
    tallyMissed: {
      backgroundColor: color?.('accent_active', 0.1),
      borderColor: color?.('accent_active', 0.28),
    },
    sheetHint: {
      flexDirection: 'row',
      gap: 10,
      padding: 13,
      borderRadius: 16,
      backgroundColor: color?.('accent_active', 0.1),
    },
    sheetList: {
      maxHeight: 380,
    },
    sheetListContent: {
      paddingBottom: 4,
    },
    sheetLoader: {
      paddingVertical: 40,
    },
    dayLabel: {
      paddingTop: 10,
      paddingBottom: 2,
    },
    // Строки разделены линией, а не плашками: двадцать залитых плашек — это
    // двадцать одинаковых пятен, в которых не видно, что пошло не так.
    questionDivider: {
      height: 1,
      backgroundColor: color?.('surface_stroke'),
    },
    question: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 11,
    },
    questionBadge: {
      width: 30,
      height: 30,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeGood: {
      backgroundColor: color?.('text_positive', 0.12),
    },
    badgeRetry: {
      backgroundColor: color?.('accent_warning', 0.14),
    },
    badgeMissed: {
      backgroundColor: color?.('accent_active', 0.12),
    },
    questionText: {
      flex: 1,
    },
    hint: {
      marginTop: 4,
      padding: 16,
      borderRadius: 22,
      flexDirection: 'row',
      gap: 10,
      backgroundColor: color?.('surface_secondary'),
    },
    empty: {
      marginTop: 40,
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 32,
    },
  });
