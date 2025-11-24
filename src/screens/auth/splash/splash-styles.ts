import { Dimensions, StyleSheet } from 'react-native';

const width = Dimensions.get('window').width;

export const splashStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoMin: {
      width: width/1.5,
      height: width/1.8,
      resizeMode: 'contain',
    },
  });
