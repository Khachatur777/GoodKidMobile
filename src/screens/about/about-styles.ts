import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const aboutStyles = (color?: IGetColor) =>
  StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 18,
      paddingBottom: 120,
      gap: 14,
    },
    logoBlock: {
      alignItems: 'center',
      gap: 10,
      paddingTop: 18,
      paddingBottom: 6,
    },
    logo: {
      width: 220,
      height: 120,
      resizeMode: 'contain',
    },
    versionChip: {
      paddingVertical: 5,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: color?.('accent_active', 0.12),
    },
    card: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 26,
      padding: 20,
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
    },
    description: {
      lineHeight: 23,
    },
    cardList: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 26,
      paddingHorizontal: 18,
      paddingVertical: 4,
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
    },
    footer: {
      textAlign: 'center',
      paddingTop: 2,
    },
  });
