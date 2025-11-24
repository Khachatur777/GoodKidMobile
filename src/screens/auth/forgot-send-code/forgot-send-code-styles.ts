import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export const forgotSendCodeStyles = () =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 40,
      justifyContent: 'space-between',
    },
    logo: {
      width: width/1.5,
      height: width/1.8,
      resizeMode: 'contain',
    },
    container: {
      marginTop: width * 0.1,
      flex: 1,
      alignItems: 'center',
      width: '100%',
    },
    btnContainer: {
      width: '100%',
      paddingHorizontal: 16
    }
  });
