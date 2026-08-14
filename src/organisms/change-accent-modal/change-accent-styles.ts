import {StyleSheet} from 'react-native';

export const changeAccentStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
    },
    swatchRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
    swatchOuter: {
      padding: 3,
      borderRadius: 999,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    swatch: {
      width: 44,
      height: 44,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
