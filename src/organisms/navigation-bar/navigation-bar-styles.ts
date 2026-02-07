import {StyleSheet} from 'react-native';
import {IColor, IGetColor} from 'theme';

export const navBarStyles = ({
  color,
  statusBarHeight = 0,
  backgroundColor = 'bg_secondary',
  backgroundColorOpacity = 1,
}: {
  color?: IGetColor;
  statusBarHeight?: number;
  backgroundColor?: IColor;
  backgroundColorOpacity?: number;
}) =>
  StyleSheet.create({
    container: {
      paddingTop: statusBarHeight,
      backgroundColor: color?.(backgroundColor, backgroundColorOpacity),
    },


    // Section
    sectionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      height: 44,
      justifyContent: 'space-between',
    },
    sectionLeftContainer: {
      paddingBottom: 8
    },
    sectionLeftIconContainer: {
      width: 32,
      height: 32,
      justifyContent: 'center',
    },
    backTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    leftIcon: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    sectionRightIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 24,
      minWidth: 32,
      minHeight: 32,
    },
    logoImag: {
      height: 55,
      width: 78,
      resizeMode: 'contain',
    },


    // Title
    titleContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 8,
      gap: 18,
    },
    titleTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
