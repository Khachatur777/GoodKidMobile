import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const taskFormStyles = (color?: IGetColor) =>
  StyleSheet.create({
    scroll: {
      paddingHorizontal: 22,
      paddingBottom: 190,
      gap: 18,
    },
    section: {
      gap: 10,
    },
    label: {
      paddingLeft: 2,
    },
    emojiRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    emojiTile: {
      width: 52,
      height: 52,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: color?.('surface_primary'),
    },
    emojiTileSelected: {
      borderColor: color?.('accent_active'),
    },
    emoji: {
      fontSize: 24,
    },
    // Шаг в одну звезду: награда — небольшое число, и клавиатура здесь только
    // мешала бы. Идеальная сессия математики даёт пять.
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    stepperButton: {
      width: 56,
      height: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_primary'),
    },
    stepperValue: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: color?.('surface_primary'),
    },
    note: {
      flexDirection: 'row',
      gap: 10,
      padding: 14,
      borderRadius: 16,
      backgroundColor: color?.('surface_secondary'),
    },
    noteText: {
      flex: 1,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
      borderRadius: 18,
      backgroundColor: color?.('surface_primary'),
    },
    switchText: {
      flex: 1,
      gap: 2,
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
    },
  });
