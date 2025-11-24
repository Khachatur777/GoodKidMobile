import {Platform, StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const tabBarStyles = ({color}: {color?: IGetColor}) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      height: Platform.OS === 'ios' ? 82 : 72,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: color?.('controls_tab_bar_bg'),
      borderTopWidth: 0.5,
      borderTopColor: color?.('surface_stroke'),
    },
    tabButtonContainer: {
      flex: 1,
    },
    tabButton: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      paddingTop: 12,
      paddingBottom: 16,
      height: 72,
    },
    iconContainer: {
      position: 'relative',
    },
    badgeContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1,
      borderWidth: 2,
      borderColor: color?.('controls_tab_bar_bg'),
      borderRadius: 100,
    },
  });
