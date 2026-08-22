import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const kidProfileStyles = (color?: IGetColor) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: 140,
    },
    wrapper: {
      paddingHorizontal: 22,
      gap: 18,
    },
    userCard: {
      alignItems: 'center',
      gap: 12,
      backgroundColor: color?.('surface_primary'),
      borderRadius: 30,
      paddingVertical: 26,
      paddingHorizontal: 22,
    },
    pillsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    pill: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 999,
    },
    accentPill: {
      backgroundColor: color?.('surface_secondary'),
    },
    mutedPill: {
      backgroundColor: color?.('surface_footer'),
    },
    accentDotsRow: {
      flexDirection: 'row',
      gap: 6,
      alignItems: 'center',
    },
    accentDot: {
      width: 22,
      height: 22,
      borderRadius: 11,
    },
    accentDotSelected: {
      borderWidth: 2,
      borderColor: color?.('surface_primary'),
    },
  });
