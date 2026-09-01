import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const kidTasksStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 22,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 14,
    },
    headerText: {
      flex: 1,
    },
    starsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: color?.('surface_secondary'),
    },
    listContent: {
      paddingBottom: 140,
      gap: 12,
    },
    groupTitle: {
      paddingTop: 18,
      paddingBottom: 2,
    },
    card: {
      borderRadius: 20,
      padding: 18,
      gap: 14,
      backgroundColor: color?.('surface_primary'),
    },
    // Отмеченные и закрытые задачи глушатся фоном, а не серым текстом: ребёнку
    // важно их видеть, но действовать там уже нечего.
    cardMuted: {
      backgroundColor: color?.('surface_secondary'),
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    cardText: {
      flex: 1,
      gap: 4,
    },
    reward: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 7,
      paddingHorizontal: 11,
      borderRadius: 999,
      backgroundColor: color?.('surface_secondary'),
    },
    rewardOnMuted: {
      backgroundColor: color?.('surface_primary'),
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 32,
      paddingBottom: 80,
    },
    emptyCircle: {
      width: 104,
      height: 104,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
      marginBottom: 4,
    },
  });
