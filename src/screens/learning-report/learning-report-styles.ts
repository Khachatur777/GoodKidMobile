import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const learningReportStyles = (color?: IGetColor) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: 18,
      paddingBottom: 60,
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
