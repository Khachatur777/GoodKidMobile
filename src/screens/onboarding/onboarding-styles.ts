import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const onboardingStyles = (color?: IGetColor, width = 390) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    skipRow: {
      alignItems: 'flex-end',
      paddingHorizontal: 22,
      paddingTop: 8,
      height: 44,
      justifyContent: 'center',
    },
    slide: {
      width,
      paddingHorizontal: 22,
      alignItems: 'center',
    },
    // The illustration block from the design: full width, radius 32, tinted background
    illustration: {
      alignSelf: 'stretch',
      height: 380,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    texts: {
      paddingTop: 34,
      gap: 10,
      alignItems: 'center',
    },
    footer: {
      paddingHorizontal: 22,
      paddingBottom: 12,
      minHeight: 120,
      justifyContent: 'flex-end',
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      height: 60,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: color?.('surface_stroke'),
    },
    dotActive: {
      width: 26,
      backgroundColor: color?.('accent_active'),
    },
  });
