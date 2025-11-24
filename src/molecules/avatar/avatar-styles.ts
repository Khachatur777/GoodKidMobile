import {StyleSheet} from 'react-native';
import {AvatarProps} from './Avatar';
import {IGetColor} from 'theme';

export const avatarStyles = ({
  size,
  color,
  borderColor = 'surface_tertiary',
  backgroundColor = 'surface_avatar_background',
  borderRadius = 50,
}: Partial<AvatarProps> & {color?: IGetColor}) => {
  const getAvatarSizes = () => {
    switch (size) {
      case 'xxl':
        return {
          width: 96,
          height: 96,
        };
      case 'xl':
        return {
          width: 80,
          height: 80,
        };
      case 'large':
        return {
          width: 64,
          height: 64,
        };
      case 'medium':
        return {
          width: 48,
          height: 48,
        };
      case 'small':
        return {
          width: 40,
          height: 40,
        };
      case 'xs':
        return {
          width: 32,
          height: 32,
        };
      case 'xxs':
        return {
          width: 24,
          height: 24,
        };
      case '3xs':
        return {
          width: 16,
          height: 16,
        };
      default:
        return {
          width: 96,
          height: 96,
        };
    }
  };

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.(backgroundColor),
      borderColor: color?.(borderColor),
      borderRadius: borderRadius,
      borderWidth: 1,
      width: getAvatarSizes().width,
      height: getAvatarSizes().height,
    },
    imageWrapper: {
      width: getAvatarSizes().width,
      height: getAvatarSizes().height,
      borderColor: color?.(borderColor),
      borderWidth: 1,
      borderRadius: borderRadius,
    },
    svgContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: borderRadius,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarTitle: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
