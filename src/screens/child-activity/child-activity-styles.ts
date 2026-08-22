import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const childActivityStyles = (color?: IGetColor) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    headerTexts: {
      gap: 2,
    },
    scrollContainer: {
      paddingHorizontal: 20,
      paddingBottom: 60,
      gap: 10,
    },
    dayLabel: {
      paddingTop: 18,
      paddingBottom: 8,
    },
    videoRow: {
      flexDirection: 'row',
      gap: 12,
      backgroundColor: color?.('surface_primary'),
      borderRadius: 22,
      padding: 10,
    },
    thumbnail: {
      width: 96,
      height: 62,
      borderRadius: 15,
      backgroundColor: color?.('bg_secondary'),
    },
    rowTexts: {
      flex: 1,
      justifyContent: 'space-between',
      paddingVertical: 2,
    },
    rowMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
    },
    learnRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: color?.('surface_primary'),
      borderRadius: 22,
      padding: 12,
    },
    learnTile: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: color?.('surface_secondary'),
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 10,
    },
    tabs: {
      paddingHorizontal: 20,
      paddingBottom: 8,
    },
  });
