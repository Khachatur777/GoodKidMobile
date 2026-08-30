import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const childMathStyles = (color?: IGetColor) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: 18,
      paddingBottom: 120,
      gap: 14,
    },
    intro: {
      marginTop: 6,
      marginBottom: 2,
      paddingHorizontal: 2,
    },
    card: {
      padding: 18,
      borderRadius: 24,
      gap: 14,
      backgroundColor: color?.('surface_primary'),
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    sign: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    signText: {
      fontSize: 24,
      fontWeight: '900',
      lineHeight: 30,
    },
    headText: {
      flex: 1,
      gap: 2,
    },
    // Названия полей в разных языках занимают то одну строку, то две. Выравнивание
    // по низу держит сами рамки на одной линии: подпись растёт вверх, а поля
    // остаются рядом, как одна строка ввода.
    fields: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10,
    },
    field: {
      flex: 1,
    },
    // Примеры — то, по чему родитель решает, посильно ли это ребёнку. Числа
    // сами по себе ему ничего не говорят.
    examples: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    example: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 14,
      backgroundColor: color?.('surface_secondary'),
    },
    problem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      padding: 12,
      borderRadius: 14,
      backgroundColor: color?.('surface_secondary'),
    },
    problemText: {
      flex: 1,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
    },
    action: {
      flex: 1,
    },
  });
