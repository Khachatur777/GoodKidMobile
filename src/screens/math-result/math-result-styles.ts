import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const mathResultStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingBottom: 28,
      alignItems: 'center',
    },
    badge: {
      width: 96,
      height: 96,
      marginTop: 24,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    title: {
      marginTop: 18,
      textAlign: 'center',
    },
    stars: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 22,
    },
    starsCount: {
      marginTop: 14,
    },
    message: {
      marginTop: 10,
      textAlign: 'center',
      paddingHorizontal: 12,
    },
    statCard: {
      width: '100%',
      marginTop: 26,
      padding: 18,
      borderRadius: 24,
      gap: 14,
      backgroundColor: color?.('surface_primary'),
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statValue: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    buttons: {
      width: '100%',
      marginTop: 'auto',
      gap: 12,
    },
    primary: {
      height: 68,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_active'),
    },
    secondary: {
      height: 68,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    buttonText: {
      fontSize: 20,
      fontWeight: '900',
    },
  });
