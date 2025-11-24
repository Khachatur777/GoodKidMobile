import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const pinStyles = ({
  color,
  statusBarHeight,
  isVisible,
}: {
  color?: IGetColor;
  statusBarHeight?: number;
  isVisible?: boolean;
}) =>
  StyleSheet.create({
    container: {
      display: isVisible ? 'flex' : 'none',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: color?.('bg_primary'),
      paddingBottom: 72,
    },

    appContainer: {
      flex: isVisible ? 0 : 1,
    },
    title: {
      textAlign: 'center',
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 16,
      paddingTop: (statusBarHeight || 0) + 4,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    pinAvatarIcon: {
      position: 'absolute',
      zIndex: -1,
    },
    goBackBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      marginLeft: -8,
    },
  });
