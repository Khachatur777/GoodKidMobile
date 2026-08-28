import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const starsCardStyles = (color?: IGetColor) =>
  StyleSheet.create({
    card: {
      padding: 20,
      borderRadius: 28,
      gap: 16,
      backgroundColor: color?.('surface_primary'),
    },
    totalRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    total: {
      fontSize: 40,
      fontWeight: '900',
      lineHeight: 46,
    },
    totalText: {
      flex: 1,
      gap: 2,
    },
    // Полоска до следующей награды: абстрактное число для четырёхлетки ничего
    // не значит, а «осталось три» — значит.
    track: {
      height: 10,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: color?.('surface_stroke'),
    },
    fill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: color?.('accent_active'),
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    avatarSlot: {
      alignItems: 'center',
      gap: 6,
    },
    lockedOverlay: {
      opacity: 0.35,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
  });
