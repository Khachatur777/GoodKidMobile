import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const childStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 18,
    },
    content: {
      paddingBottom: 130,
      gap: 14,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 18,
      borderRadius: 24,
      backgroundColor: color?.('surface_primary'),
    },
    headerText: {
      flex: 1,
      gap: 3,
    },
    balance: {
      alignItems: 'flex-end',
      gap: 2,
    },
    balanceValue: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    groupTitle: {
      paddingHorizontal: 4,
      paddingTop: 2,
    },
    // Разделы списком, а не сеткой кнопок: у каждого справа значение, ради
    // которого родитель сюда и зашёл.
    groupCard: {
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 4,
      backgroundColor: color?.('surface_primary'),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingVertical: 15,
    },
    rowDivided: {
      borderBottomWidth: 1,
      borderBottomColor: color?.('surface_stroke'),
    },
    tile: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    // «+−» вместо иконки: 17px, вес 900 — как в макете.
    glyph: {
      fontSize: 17,
      fontWeight: '900',
      color: color?.('accent_active'),
    },
    tileAlert: {
      backgroundColor: color?.('accent_negative', 0.12),
    },
    tileOk: {
      backgroundColor: color?.('accent_positive', 0.12),
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    rowValue: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    counter: {
      minWidth: 22,
      height: 22,
      paddingHorizontal: 6,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_negative'),
    },
  });
