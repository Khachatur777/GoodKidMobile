import { StyleSheet } from 'react-native';

export const learnExplanationStyles = () =>
  StyleSheet.create({
    image: {
      width: '46%',
      aspectRatio: 1,
      borderRadius: 24,
      marginBottom: 16,
    },
    cardContainer: {
      flex: 1,
    },
    scrollContainer: {
      borderRadius: 28,
      padding: 20,
      margin: 16,
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    imgContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    //ChangeLanguageLearnModal
    modalContainer: {
      paddingHorizontal: 16,
    },
  });
