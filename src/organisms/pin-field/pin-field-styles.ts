import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';
import {PinFieldProps} from './PinField';

export const pinFieldStyles = ({
  isCircleActive,
  error,
  color,
}: Partial<PinFieldProps> & {
  isCircleActive?: boolean;
  error?: boolean;
  color?: IGetColor;
}) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 72,
    },
    top: {
      alignItems: 'center',
      height: 98,
    },
    numbersContainer: {
      maxWidth: 288,
      gap: 24,
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    number: {
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 80,
      width: '100%',
      height: 80,
      borderRadius: 40,
      backgroundColor: color?.('controls_secondary_default'),
    },
    circlesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    circle: {
      width: 16,
      height: 16,
      borderRadius: 10,
      backgroundColor: isCircleActive
        ? color?.('red_500')
        : color?.(error ? 'accent_negative' : 'icon_tertiary'),
    },
    forgotPin: {
      width: 65,
    },
  });
