import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const mathCardStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 22,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 8,
    },
    // 60×60 у кнопок сверху: минимальная зона нажатия для детской руки.
    topButton: {
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressBox: {
      flex: 1,
      gap: 7,
      paddingHorizontal: 4,
    },
    progressLabel: {
      textAlign: 'center',
    },
    progressTrack: {
      height: 8,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: color?.('surface_stroke'),
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: color?.('accent_active'),
    },
    // Формула — главный элемент экрана. Ребёнок 4–6 лет читает задание по
    // цифрам и знаку, поэтому текстового вопроса здесь нет вообще.
    formulaCard: {
      height: 186,
      borderRadius: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: color?.('surface_primary'),
      shadowColor: '#191634',
      shadowOpacity: 0.08,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    operand: {
      fontSize: 72,
      fontWeight: '900',
      lineHeight: 82,
    },
    operator: {
      fontSize: 58,
      fontWeight: '900',
      lineHeight: 66,
    },
    equals: {
      fontSize: 54,
      fontWeight: '900',
      lineHeight: 62,
    },
    answerBox: {
      height: 104,
      marginTop: 14,
      borderRadius: 26,
      borderWidth: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      backgroundColor: color?.('surface_primary'),
      borderColor: color?.('accent_active'),
    },
    // Ошибка красится тёплым, а не тревожным красным, и надписи «Неправильно»
    // нет: ребёнок пробует снова на том же примере.
    answerBoxWrong: {
      borderColor: color?.('accent_warning'),
    },
    answerBoxCorrect: {
      borderColor: color?.('text_positive'),
    },
    answerText: {
      fontSize: 58,
      fontWeight: '900',
      lineHeight: 66,
    },
    caret: {
      width: 5,
      height: 56,
      borderRadius: 3,
      backgroundColor: color?.('accent_active'),
    },
    pad: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 14,
    },
    key: {
      width: '31.5%',
      height: 66,
      marginBottom: 10,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_primary'),
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    keyEmpty: {
      backgroundColor: 'transparent',
      shadowOpacity: 0,
      elevation: 0,
    },
    keyBackspace: {
      backgroundColor: color?.('surface_secondary'),
      shadowOpacity: 0,
      elevation: 0,
    },
    keyText: {
      fontSize: 30,
      fontWeight: '900',
      lineHeight: 36,
    },
    submit: {
      height: 72,
      marginTop: 'auto',
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_active'),
    },
    submitDisabled: {
      backgroundColor: color?.('controls_disabled_primary'),
    },
    submitText: {
      fontSize: 22,
      fontWeight: '900',
    },
  });
