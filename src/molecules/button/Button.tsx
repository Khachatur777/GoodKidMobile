import {IIcons} from 'assets';
import {Icon, Typography, TypographyProps} from 'molecules';
import {FC, useContext, useMemo} from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {IColor, ThemeContext} from 'theme';
import {btnStyles} from './button-styles';

export type ButtonVariants =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'negative'
  | 'ghost';

export type Sizes = 'small' | 'medium' | 'large';

export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'inverted';
  variant?: ButtonVariants;
  size?: Sizes;
  title: string;
  titleProps?: Omit<TypographyProps, 'children'>;
  startIconName?: IIcons;
  endIconName?: IIcons;
  isLoading?: boolean;
  fullWidth?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  contentContainerStyles?: StyleProp<ViewStyle>;
}

const Button: FC<ButtonProps> = ({
  title,
  onPress,
  size = 'medium',
  variant = 'primary',
  startIconName,
  endIconName,
  isLoading,
  disabled,
  contentContainerStyles,
  fullWidth,
  titleProps,
  type = 'primary',
}) => {
  const {color} = useContext(ThemeContext);

  const getColor: IColor = useMemo(() => {
    switch (type) {
      case 'primary':
        return disabled
          ? 'text_tertiary'
          : variant === 'primary'
          ? 'grey_0'
          : variant === 'negative'
          ? 'accent_negative'
          : 'text_primary';
      case 'secondary':
        return disabled
          ? 'text_tertiary'
          : variant === 'primary'
          ? 'grey_0'
          : variant === 'negative'
          ? 'accent_negative'
          : 'text_primary';
      case 'inverted':
        return disabled
          ? 'text_tertiary'
          : variant === 'primary'
          ? 'accent_active'
          : variant === 'outline'
          ? 'text_inverted'
          : variant === 'negative'
          ? 'accent_negative'
          : variant === 'ghost'
          ? 'text_inverted'
          : 'text_primary';
      default:
        return 'text_primary';
    }
  }, [variant, disabled, type]);

  const getTitleType = useMemo(
    () => (size === 'small' ? 'bodySBold' : 'bodyBold'),
    [size],
  );

  const getIconSizes = useMemo(
    () =>
      size === 'small'
        ? {
            width: 20,
            height: 20,
          }
        : {width: 24, height: 24},
    [size],
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading || disabled}
      style={({pressed}) => [
        btnStyles({pressed, size, color, fullWidth, disabled, isLoading})
          .container,
        btnStyles({color, disabled, pressed, isLoading, type})[variant],
        contentContainerStyles,
      ]}>
      {startIconName ? (
        <Icon
          width={getIconSizes?.width}
          height={getIconSizes?.height}
          name={startIconName}
          color={getColor}
          opacity={isLoading ? 0 : 1}
        />
      ) : null}

      <Typography
        numberOfLines={1}
        textColor={getColor}
        type={getTitleType}
        textStyles={btnStyles({isLoading}).title}
        {...titleProps}>
        {title}
      </Typography>

      {endIconName ? (
        <Icon
          width={getIconSizes?.width}
          height={getIconSizes?.height}
          name={endIconName}
          color={getColor}
          opacity={isLoading ? 0 : 1}
        />
      ) : null}

      {isLoading ? (
        <View style={btnStyles({}).loaderContainer}>
          <Icon
            width={getIconSizes?.width}
            height={getIconSizes?.height}
            name="Loading"
            color={getColor}
          />
        </View>
      ) : null}
    </Pressable>
  );
};

export default Button;
