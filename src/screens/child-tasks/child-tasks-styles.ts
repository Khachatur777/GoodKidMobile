import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const childTasksStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 22,
    },
    selectorRow: {
      paddingTop: 8,
      paddingBottom: 4,
    },
    listContent: {
      paddingTop: 8,
      paddingBottom: 190,
      gap: 10,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 20,
      paddingBottom: 4,
    },
    // Счётчик ждущих подтверждения — единственный сигнал, что ребёнок что-то
    // доделал: пушей в приложении нет.
    counter: {
      minWidth: 22,
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_active'),
    },
    card: {
      borderRadius: 20,
      padding: 16,
      gap: 12,
      backgroundColor: color?.('surface_primary'),
    },
    cardMuted: {
      backgroundColor: color?.('surface_secondary'),
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    iconTile: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    iconTileOnMuted: {
      backgroundColor: color?.('surface_primary'),
    },
    emoji: {
      fontSize: 20,
    },
    cardText: {
      flex: 1,
      gap: 3,
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
    actionsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    action: {
      flex: 1,
    },
    // Липкая подложка, а не просто кнопка: без фона содержимое прокручивается
    // сквозь неё. Волосяная линия сверху — как на экране фильтра, чтобы было
    // видно, что список уходит под панель. 92 = таб-бар (24 снизу + 68 высоты).
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 92,
      paddingHorizontal: 22,
      paddingTop: 12,
      paddingBottom: 14,
      backgroundColor: color?.('bg_primary'),
      borderTopWidth: 1,
      borderTopColor: color?.('controls_border_default', 0.5),
      flexDirection: 'row',
      gap: 10,
    },
    footerMain: {
      flex: 1,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingHorizontal: 24,
      paddingBottom: 100,
    },
    emptyCircle: {
      width: 96,
      height: 96,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
      marginBottom: 4,
    },
  });
