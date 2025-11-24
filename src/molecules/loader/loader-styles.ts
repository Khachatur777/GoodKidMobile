import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const loaderStyles = ({color}: {color?: IGetColor}) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999999,
      backgroundColor: color?.('bg_overlay', 0.5),
    },
  });
