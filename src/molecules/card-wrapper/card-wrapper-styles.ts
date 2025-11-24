import {Platform, StyleSheet} from 'react-native';
import {IGetColor} from 'theme';
import {CardWrapperProps} from 'molecules';

export const cardWrapperStyles = ({
  color,
  backgroundColor = 'surface_primary',
  borderColor = 'surface_stroke',
  radius = 24,
  backgroundColorOpacity = 1,
  headerPaddingLeft = 16,
  headerPaddingRight = 16,
}: Partial<CardWrapperProps> & {color?: IGetColor}) =>
  StyleSheet.create({
    container: {
      flexShrink: 1,
      borderRadius: radius,
      backgroundColor: color?.(backgroundColor, backgroundColorOpacity),
    },
    shadow: {
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 16,
      shadowColor: color?.('blue_900', Platform.OS === 'android' ? 0.4 : 0.18),
    },
    outline: {
      borderWidth: 0.5,
      borderColor: color?.(borderColor),
    },
    default: {},
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: headerPaddingLeft,
      paddingRight: headerPaddingRight,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      gap: 8,
    },
    headerSubTitle: {
      paddingLeft: headerPaddingLeft,
    },
    headerBtn: {
      width: 40,
      padding: 10,
      alignItems: 'flex-end',
    },
  });
