import { StyleSheet } from 'react-native';
import { BadgeProps } from './Badge';
import { IGetColor } from 'theme';

export const badgeStyles = ({
                              variant,
                              size,
                              color,
                              backgroundColor,
                              borderWidth = 1,
                              borderColor = 'surface_tertiary'
                            }: Partial<BadgeProps> & { color: IGetColor }) => {
  const getBgColor = () => {
    switch (variant) {
      case 'primary': {
        return color?.('surface_secondary');
      }
      case 'secondary': {
        return color?.('surface_quaternary');
      }
      case 'inverted': {
        return color?.('surface_inverted');
      }
      default:
        break;
    }
  };

  const getBadgeSizes = () => {
    switch (size) {
      case 'large':
        return {
          height: 36,
          paddingVertical: 6,
          paddingHorizontal: 16,
        };
      case 'medium':
        return {
          height: 24,
          paddingVertical: 2,
          paddingHorizontal: 12,
        };
      case 'small':
        return {
          height: 20,
          paddingVertical: 2,
          paddingHorizontal: 8,
        };
      default:
        break;
    }
  };

  return StyleSheet.create({
    container: {
      flexShrink: 1,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      borderWidth: borderWidth,
      borderColor: color?.(borderColor),
      backgroundColor: backgroundColor
        ? color?.(backgroundColor)
        : getBgColor(),
      borderRadius: 16,
      ...getBadgeSizes(),
    },
  });
};
