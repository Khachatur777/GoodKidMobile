import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export const signUpStyles = () =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 40
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logo: {
      width: width/1.5,
      height: width/1.8,
      resizeMode: 'contain',
    },
    btnContainer: {
      width: '100%',
      paddingHorizontal: 16,
      marginTop: 16
    },
    termsContainer: {
      width: '100%',
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
    termsText: {
      marginLeft: 8
    }
  });
