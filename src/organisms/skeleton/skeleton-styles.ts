import {StyleSheet} from 'react-native';

export const skeletonStyles = () =>
  StyleSheet.create({
    cellContainer: {
      flexDirection: 'row',
      height: 64,
      paddingVertical: 8,
    },
    cellRows: {
      paddingTop: 12,
      paddingBottom: 6,
      gap: 12,
    },

    // Card Skeleton
    cardSkeletonContainer: {
      justifyContent: 'space-between',
      paddingBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
    },
    cardFooterSkeletonContainer: {
      flexDirection: 'row',
      marginLeft: 16,
      alignItems: 'center'
    }
  });
