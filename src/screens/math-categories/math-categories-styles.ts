import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const mathCategoriesStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    starsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-end',
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: color?.('surface_secondary'),
      marginBottom: 8,
    },
    groupTitle: {
      marginTop: 18,
      marginBottom: 10,
    },
    // Зона нажатия — вся плитка целиком: у четырёхлетки палец крупнее и менее
    // точный, чем у взрослого.
    item: {
      minHeight: 96,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      padding: 18,
      marginBottom: 12,
      borderRadius: 28,
      backgroundColor: color?.('surface_primary'),
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    // Категория не по возрасту не прячется и не блокируется: она спокойнее по
    // виду, но открыта. Ребёнок, который готов раньше, должен до неё дотянуться.
    itemAhead: {
      backgroundColor: color?.('surface_secondary'),
      shadowOpacity: 0,
      elevation: 0,
    },
    sign: {
      width: 64,
      height: 64,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    signAhead: {
      backgroundColor: color?.('surface_primary'),
    },
    signText: {
      fontSize: 34,
      fontWeight: '900',
      lineHeight: 40,
    },
    itemText: {
      flex: 1,
      gap: 3,
    },
    listContent: {
      paddingBottom: 120,
    },
  });
