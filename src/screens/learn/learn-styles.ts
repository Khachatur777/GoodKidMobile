import { StyleSheet, Dimensions } from 'react-native';
import { IGetColor } from 'theme';

const { width } = Dimensions.get('window');

export const learnStyles = (color?: IGetColor) =>
  StyleSheet.create({
    flatListContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 18,
      paddingBottom: 120,
    },
    categoriesItemContainer: {
      position: 'relative',
      width: (width - 50) / 2,
      marginTop: 14,
      borderRadius: 24,
      padding: 8,
      paddingBottom: 12,
      backgroundColor: color?.('surface_primary'),
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: {width: 0, height: 3},
      elevation: 3,
    },
    lock_icon: {
      position: 'absolute',
      top: '40%',
      alignSelf: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(246, 244, 251, 0.45)',
      borderRadius: 24,
      zIndex: 1,
    },
    blurredText: {
      opacity: 0.4,
    },
    image: {
      width: '100%',
      height: 104,
      borderRadius: 18,
      resizeMode: 'cover',
    },
    cardTitle: {
      paddingTop: 10,
      paddingHorizontal: 6,
    },
    subtitle: {
      paddingHorizontal: 18,
      paddingTop: 4,
    },
  });
