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
      alignItems: 'center',
      marginTop: 16
    },
    image: {
      paddingBottom: 4,
      width: (width - 40) / 2,
      height: 150,
      borderRadius: 8,
      resizeMode: 'cover',
    },
  });
