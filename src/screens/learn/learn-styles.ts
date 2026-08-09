import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const learnStyles = () =>
  StyleSheet.create({
    flatListContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      flex: 1,
    },
    categoriesItemContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    lock_icon: {
      position: 'absolute',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      height: 147,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: 8,
    },
    blurredText: {
      opacity: 0.4,
    },
    image: {
      paddingBottom: 4,
      width: (width - 40) / 2,
      height: 150,
      borderRadius: 8,
      resizeMode: 'cover',
    },
  });
