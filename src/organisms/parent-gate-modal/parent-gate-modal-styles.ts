import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

// Размеры и радиусы взяты из handoff: плитка иконки 60/20, карточка вопроса 22,
// поле ответа 160×60/18, клавиши 56/18, кнопки низа 50/50.
export const parentGateStyles = (color?: IGetColor, isDark?: boolean) =>
  StyleSheet.create({
    content: {
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingBottom: 8,
    },
    iconTile: {
      width: 60,
      height: 60,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    iconTileError: {
      backgroundColor: isDark ? '#3A2F16' : '#FFF1CE',
    },
    iconGlyph: {
      fontSize: 28,
    },
    questionCard: {
      alignSelf: 'stretch',
      alignItems: 'center',
      gap: 14,
      borderRadius: 22,
      paddingVertical: 20,
      backgroundColor: color?.('bg_primary'),
    },
    questionCardError: {
      backgroundColor: isDark ? '#3A1A12' : '#FCF0EC',
    },
    answerBox: {
      width: 160,
      height: 60,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: color?.('surface_stroke'),
      backgroundColor: color?.('surface_primary'),
    },
    answerBoxFocused: {
      borderColor: color?.('accent_active'),
    },
    answerBoxError: {
      borderColor: color?.('accent_negative'),
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    keypad: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: 10,
    },
    key: {
      width: '31%',
      height: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: isDark ? 0 : 1,
      borderColor: color?.('surface_stroke'),
      backgroundColor: isDark ? color?.('surface_secondary') : color?.('surface_primary'),
    },
    keyEmpty: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    footer: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      gap: 12,
    },
    footerButton: {
      flex: 1,
    },
  });
