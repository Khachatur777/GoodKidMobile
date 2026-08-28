import { StyleSheet, Dimensions } from 'react-native';
import { IGetColor } from 'theme';

const { width } = Dimensions.get('window');

export const cardCategoriesStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 18,
    },
    listContent: {
      paddingBottom: 120,
    },
    columnWrapper: {
      justifyContent: 'space-between',
    },
    groupTitle: {
      marginTop: 16,
      marginBottom: 8,
      marginLeft: 4,
    },
    item: {
      width: (width - 48) / 2,
      marginTop: 14,
      borderRadius: 24,
      overflow: 'hidden',
      backgroundColor: color?.('surface_primary'),
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 3 },
      elevation: 3,
    },
    itemAhead: {
      opacity: 0.75,
    },
    image: {
      width: '100%',
      height: 118,
      backgroundColor: color?.('surface_secondary'),
    },
    itemBody: {
      padding: 12,
      gap: 4,
    },
    lockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    starsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    // Состояние ошибки сети — не пустой экран, а понятная причина и кнопка:
    // ребёнок должен видеть, что дело не в нём.
    stateBox: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 12,
    },
    retry: {
      marginTop: 8,
      height: 56,
      paddingHorizontal: 28,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_active'),
    },
  });
