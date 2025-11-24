import {IIcons} from 'assets';
import {Icon, IconProps, Typography, TypographyProps} from 'molecules';
import {FC, useCallback, useContext} from 'react';
import {
  GestureResponderEvent,
  Image,
  ImageProps,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {SvgUri} from 'react-native-svg';
import {IColor, ThemeContext} from 'theme';
import {avatarStyles} from './avatar-styles';

export type AvatarSizeType =
  | 'xxl'
  | 'xl'
  | 'large'
  | 'medium'
  | 'small'
  | 'xs'
  | 'xxs'
  | '3xs';

export interface AvatarProps {
  size?: AvatarSizeType;
  iconName?: IIcons;
  iconColor?: IColor;
  iconProps?: Omit<IconProps, 'name'>;
  title?: string;
  svgUri?: string;
  titleProps?: Omit<TypographyProps, 'children'>;
  source?: ImageSourcePropType;
  imageProps?: ImageProps;
  borderRadius?: number;
  borderColor?: IColor;
  backgroundColor?: IColor;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  svg?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  imageWrapperStyles?: StyleProp<ViewStyle>;
  iconWrapperStyle?: StyleProp<ViewStyle>;
}

const Avatar: FC<AvatarProps> = ({
  onPress,
  size,
  title,
  source,
  iconName,
  iconColor = 'surface_avatar_content',
  svgUri = '',
  disabled = true,
  svg = false,
  containerStyles = {},
  borderRadius = 50,
  titleProps,
  imageProps,
  iconProps,
  imageWrapperStyles,
  iconWrapperStyle,
  ...props
}) => {
  const {color} = useContext(ThemeContext);

  const getTitleSizes = useCallback(() => {
    switch (size) {
      case 'xxl':
        return 'title1';
      case 'xl':
        return 'title2';
      case 'large':
        return 'title3';
      case 'medium':
        return 'headline';
      case 'small':
        return 'bodyBold';
      case 'xs':
        return 'bodySBold';
      case 'xxs':
        return 'captionBold';
      case '3xs':
        return 'description';
      default:
        break;
    }
  }, [size]);

  const getIconSizes = useCallback(() => {
    switch (size) {
      case 'xxl':
        return {
          width: 50,
          height: 50,
        };
      case 'xl':
        return {
          width: 40,
          height: 40,
        };
      case 'large':
        return {
          width: 30,
          height: 30,
        };
      case 'medium':
        return {
          width: 24,
          height: 24,
        };
      case 'small':
        return {
          width: 20,
          height: 20,
        };
      case 'xs':
        return {
          width: 16,
          height: 16,
        };
      case 'xxs':
        return {
          width: 12,
          height: 12,
        };
      case '3xs':
        return {
          width: 8,
          height: 8,
        };
      default:
        break;
    }
  }, [size]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        avatarStyles({size, color, borderRadius, ...props}).container,
        containerStyles,
      ]}>
      {title ? (
        <Typography
          textStyles={avatarStyles({}).avatarTitle}
          textColor="surface_avatar_content"
          alignment="center"
          type={getTitleSizes()}
          {...titleProps}>
          {title}
        </Typography>
      ) : null}

      {source && !svg ? (
        <View
          style={[
            avatarStyles({size, color, borderRadius, ...props}).imageWrapper,
            imageWrapperStyles,
          ]}>
          <Image
            borderRadius={borderRadius}
            source={source}
            resizeMode="cover"
            style={avatarStyles({size, borderRadius}).image}
            onLoad={() => {}}
            {...imageProps}
          />
        </View>
      ) : null}

      {svgUri && svg ? (
        <View
          style={[
            avatarStyles({size, color, borderRadius, ...props}).imageWrapper,
            avatarStyles({}).svgContainer,
          ]}>
          <SvgUri
            width={getIconSizes()?.width}
            height={getIconSizes()?.height}
            uri={svgUri}
          />
        </View>
      ) : null}

      {iconName || iconProps ? (
        <View style={[avatarStyles({size}).iconContainer, iconWrapperStyle]}>
          <Icon
            name={iconName as 'AlertCircleIcon'}
            color={iconColor}
            width={getIconSizes()?.width}
            height={getIconSizes()?.height}
            {...iconProps}
          />
        </View>
      ) : null}
    </Pressable>
  );
};

export default Avatar;
