import {Platform, StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const tabBarStyles = ({color}: {color?: IGetColor}) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 68,
      bottom: Platform.OS === 'ios' ? 24 : 14,
      left: 16,
      right: 16,
      borderRadius: 26,
      backgroundColor: color?.('controls_tab_bar_bg', 0.97),
      shadowColor: '#191634',
      shadowOpacity: 0.18,
      shadowRadius: 15,
      shadowOffset: {width: 0, height: 10},
      elevation: 12,
    },
    tabButtonContainer: {
      flex: 1,
    },
    tabButton: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      height: 68,
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
    badge: {
      position: 'absolute',
      top: -5,
      right: -9,
      minWidth: 18,
      height: 18,
      paddingHorizontal: 5,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_active'),
    },
  });
