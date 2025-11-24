import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';
import {ButtonProps} from './Button';

export const btnStyles = ({
  color,
  size,
  fullWidth,
  disabled,
  pressed,
  isLoading,
  type = 'primary',
}: Partial<ButtonProps> & {pressed?: boolean} & {color?: IGetColor}) => {
  const getButtonSizes = () => {
    switch (size) {
      case 'large':
        return {
          height: 56,
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 12,
        };
      case 'medium':
        return {
          height: 48,
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 12,
        };
      case 'small':
        return {
          height: 32,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      default:
        break;
    }
  };

  return StyleSheet.create({
    container: {
      position: 'relative',
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : undefined,
      gap: 8,
      ...getButtonSizes(),
    },

    loaderContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },

    title: {
      opacity: isLoading ? 0 : 1,
    },

    primary: {
      backgroundColor: disabled
        ? color?.('controls_disabled_primary')
        : pressed || isLoading
        ? color?.(
            type === 'inverted'
              ? 'controls_inverted_pressed'
              : 'red_700',
          )
        : color?.(
            type === 'inverted'
              ? 'controls_inverted_default'
              : 'red_500',
          ),
    },

    secondary: {
      backgroundColor: disabled
        ? color?.('controls_disabled_primary')
        : pressed || isLoading
        ? color?.(
            type === 'secondary'
              ? 'controls_alternative_pressed'
              : 'controls_secondary_pressed',
          )
        : color?.(
            type === 'secondary'
              ? 'controls_alternative_default'
              : 'controls_secondary_default',
          ),
    },

    outline: {
      borderWidth: disabled ? 0 : 1,
      borderColor:
        isLoading || pressed
          ? color?.('controls_border_hover')
          : disabled
          ? color?.('controls_border_default', 0)
          : color?.('controls_border_default'),
      backgroundColor: disabled
        ? color?.('controls_disabled_primary')
        : color?.('text_primary', 0),
    },

    negative: {
      backgroundColor: disabled
        ? color?.('controls_disabled_primary')
        : pressed || isLoading
        ? color?.(type === 'secondary' ? 'red_200' : 'red_100')
        : color?.(type === 'secondary' ? 'red_100' : 'red_50'),
    },
    ghost: {
      backgroundColor: disabled
        ? color?.('controls_disabled_primary')
        : color?.('text_primary', 0),
    },
    c360Primary: {
      backgroundColor: disabled
        ? color?.('controls_c360_disabled')
        : pressed || isLoading
        ? color?.('controls_c360_default', 0.7)
        : color?.('controls_c360_default'),
      borderWidth: 1,
      borderColor: color?.('bg_inverted'),
    },
    c360Secondary: {},
  });
};
