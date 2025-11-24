import {PixelRatio, StyleSheet} from 'react-native';
import {RadioButtonProps} from './RadioTypes';
import {IGetColor} from 'theme';

export const radioStyles = ({
  layout = 'column',
  selected,
  color,
  inactiveBorderColor = 'controls_selector_default',
  activeBorderColor = 'red_500',

  inactiveBackgroundColor = 'controls_primary_default',
  activeBackgroundColor = 'grey_0',

  isBackgroundTransparent = true,

  borderSize = 2,
  size,
  disabled,
  error,
}: Partial<RadioButtonProps> & {color: IGetColor}) => {
  const borderWidth = PixelRatio.roundToNearestPixel(borderSize);

  const containerSize = () => {
    switch (size) {
      case 'large':
        return 32;
      case 'medium':
        return 24;
      case 'small':
        return 16;
      default:
        return 24;
    }
  };

  const sizeFull = PixelRatio.roundToNearestPixel(containerSize());

  const sizeHalf = PixelRatio.roundToNearestPixel(containerSize() * 0.5);

  const getActiveStateSizes = () => {
    switch (size) {
      case 'large':
        return 9;
      case 'medium':
        return 7;
      case 'small':
        return 5;
      default:
        break;
    }
  };

  return StyleSheet.create({
    outerContainer: {
      alignItems: 'center',
      flexDirection: layout,
      marginHorizontal: 1,
      marginVertical: 5,
      opacity: disabled ? 0.8 : 1,
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      width: sizeFull,
      height: sizeFull,
      borderColor: selected
        ? color?.(activeBorderColor)
        : color?.(error ? 'accent_negative' : inactiveBorderColor),
      backgroundColor: selected
        ? color?.(activeBackgroundColor)
        : color?.(inactiveBackgroundColor, isBackgroundTransparent ? 0 : 1),
      borderWidth: selected ? getActiveStateSizes() : borderWidth,
      borderRadius: 32,
    },

    innerContainer: {
      backgroundColor: selected
        ? color?.(activeBackgroundColor)
        : color?.(inactiveBackgroundColor),
      width: sizeHalf,
      height: sizeHalf,
      borderRadius: sizeHalf,
    },
  });
};
