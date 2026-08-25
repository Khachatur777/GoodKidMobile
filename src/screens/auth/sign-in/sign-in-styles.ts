import { StyleSheet, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

export const signInStyles = () =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      // Room under the last row so it clears the home indicator, and so the
      // keyboard never covers the field outright
      paddingBottom: 32,
    },
    container: {
      // Grows past the window instead of being pinned to it: with flex: 1 the
      // content was clipped, and "Create account" at the bottom was cut in half
      flexGrow: 1,
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
