import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const sectionsStyles = (color?: IGetColor) =>
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
    greeting: {
      flex: 1,
      gap: 3,
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
    // 168pt на плитку: раздел должен опознаваться по картинке и цвету раньше,
    // чем ребёнок прочитает название.
    tile: {
      minHeight: 138,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
      padding: 20,
      marginBottom: 14,
      borderRadius: 30,
      borderWidth: 2.5,
      backgroundColor: color?.('surface_primary'),
      borderColor: 'transparent',
    },
    tileActive: {
      borderColor: color?.('accent_active'),
    },
    // Пустой раздел не прячем, но и не даём в него зайти: тупик расстраивает
    // сильнее, чем честная надпись «скоро».
    tileSoon: {
      backgroundColor: color?.('surface_secondary'),
      opacity: 0.6,
    },
    iconBox: {
      width: 84,
      height: 84,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('bg_primary'),
    },
    tileText: {
      flex: 1,
      gap: 6,
    },
    listContent: {
      paddingBottom: 120,
    },
  });
