import { StyleSheet } from 'react-native';

export const noSignInStyles = () =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      paddingBottom: 40,
      width: '100%',
    },

    buttonContainer: {
      marginTop: 12,
      width: '100%',
      paddingHorizontal: 16,
      marginBottom: 24,
    }
  });
