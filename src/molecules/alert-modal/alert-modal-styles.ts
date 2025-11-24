import {StyleSheet} from 'react-native';

export const alertMStyles = () =>
  StyleSheet.create({
    iconContainer: {
      alignItems: 'center',
    },
    buttonsContainer: {
      gap: 8,
    },
    closeBtn: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: 32,
      height: 32,
      top: 8,
      right: 8,
    },
  });
