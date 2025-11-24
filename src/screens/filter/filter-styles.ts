import {StyleSheet} from 'react-native';

export const filterStyles = () =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 30,
      paddingBottom: 90,
    },
    filterItemsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 20,
      paddingBottom: 12,
    }
  });
