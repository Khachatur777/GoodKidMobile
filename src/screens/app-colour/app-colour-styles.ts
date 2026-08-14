import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const appColourStyles = (color?: IGetColor) =>
  StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 18,
      paddingBottom: 120,
      gap: 14,
    },
    subtitle: {
      paddingHorizontal: 4,
      paddingTop: 6,
      paddingBottom: 2,
    },
    card: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 28,
      padding: 18,
      gap: 14,
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
    },

    // Preview
    previewChipsRow: {
      flexDirection: 'row',
      gap: 7,
    },
    previewChip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: color?.('bg_primary'),
    },
    previewChipActive: {
      backgroundColor: color?.('accent_active'),
    },
    previewProgressTrack: {
      height: 6,
      borderRadius: 999,
      backgroundColor: color?.('surface_stroke'),
      overflow: 'hidden',
    },
    previewProgressFill: {
      width: '45%',
      height: '100%',
      borderRadius: 999,
      backgroundColor: '#FFC53D',
    },
    previewButton: {
      height: 52,
      borderRadius: 18,
      backgroundColor: color?.('accent_active'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },

    // Swatches
    swatchGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 14,
    },
    swatchItem: {
      width: '21%',
      alignItems: 'center',
      gap: 7,
    },
    swatchRing: {
      padding: 3,
      borderRadius: 25,
      borderWidth: 2.5,
      borderColor: 'transparent',
    },
    swatch: {
      width: 54,
      height: 54,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
