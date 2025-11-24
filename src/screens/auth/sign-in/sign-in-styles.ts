import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export const signInStyles = () =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
    },
    logo: {
      width: width/1.5,
      height: width/1.8,
      resizeMode: 'contain',
    },
    btnContainer: {
      width: '100%',
      paddingHorizontal: 16
    },
  });
