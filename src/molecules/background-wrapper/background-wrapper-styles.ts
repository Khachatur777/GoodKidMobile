import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';
import {BackgroundWrapperProps} from 'molecules';

export const bgWrapperStyles = ({
  color,
  backgroundColor = 'bg_secondary',
  paddingHorizontal = 0,
}: Partial<BackgroundWrapperProps> & {color?: IGetColor}) =>
  StyleSheet.create({
    contentContainer: {
      flex: 1,
      backgroundColor: color?.(backgroundColor),
      paddingHorizontal: paddingHorizontal,
    },
    safeArea: {
      flex: 1,
    },
  });
