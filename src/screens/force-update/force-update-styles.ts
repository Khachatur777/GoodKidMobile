import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const forceUpdateStyles = ({ color }: { color?: IGetColor }) =>
  StyleSheet.create({
    container: {
      paddingBottom: 90,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
  });
