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
    // Поля по макету: подпись сверху отдельной строкой, а не внутри рамки, как
    // в TextField приложения.
    field: {
      gap: 7,
    },
    fieldLabel: {
      paddingLeft: 2,
    },
    // Кольцо вокруг сфокусированного поля рисуется подложкой: обводки в 4 px
    // с прозрачностью в RN нет, а тень ведёт себя по-разному на платформах.
    inputRing: {
      borderRadius: 22,
      padding: 4,
      margin: -4,
    },
    inputRingFocused: {
      backgroundColor: color?.('accent_active', 0.12),
    },
    input: {
      height: 54,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: color?.('surface_stroke'),
      backgroundColor: color?.('surface_primary'),
      paddingHorizontal: 16,
      fontSize: 16,
      fontWeight: '500',
      color: color?.('text_primary'),
    },
    inputFocused: {
      borderColor: color?.('accent_active'),
    },
    inputMultiline: {
      height: 96,
      paddingTop: 14,
      paddingBottom: 14,
      lineHeight: 23,
      textAlignVertical: 'top',
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
