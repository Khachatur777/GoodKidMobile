import { StyleSheet } from 'react-native';

export const learnExplanationStyles = () =>
  StyleSheet.create({
    image: {
      width: '46%',
      aspectRatio: 1,
      borderRadius: 24,
      marginBottom: 16,
    },
    scrollContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 28,
      padding: 20,
      margin: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
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
