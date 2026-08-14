import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const learnExplanationStyles = (color?: IGetColor) =>
  StyleSheet.create({
    image: {
      width: '48%',
      aspectRatio: 1,
      borderRadius: 22,
      marginBottom: 16,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 22,
      paddingTop: 4,
      paddingBottom: 10,
    },
    progressTrack: {
      flex: 1,
      height: 6,
      borderRadius: 999,
      backgroundColor: color?.('surface_stroke'),
      overflow: 'hidden',
      marginRight: 12,
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: '#FFC53D',
    },
    languageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    languageChip: {
      paddingVertical: 7,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: color?.('accent_active', 0.12),
    },
    actionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    listenButton: {
      flex: 1,
    },
    nextButton: {
      width: 56,
      height: 56,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: color?.('surface_stroke'),
      backgroundColor: color?.('surface_primary'),
      alignItems: 'center',
      justifyContent: 'center',
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
