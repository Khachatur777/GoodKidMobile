import {IIcons} from 'assets';
import {
  Avatar,
  AvatarProps,
  Icon,
  IconProps,
  Typography,
  TypographyProps,
} from 'molecules';
import {FC, ReactNode, useContext, useMemo} from 'react';
import {
  GestureResponderEvent,
  ImageProps,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {IColor, ThemeContext} from 'theme';
import {formatNumberWithSpaces, maskedValue} from 'utils';
import {cellStyles} from './sell-styles';

export interface CellProps {
  type: 'icon' | 'card' | 'icon-on-bg' | 'image' | 'avatar';
  title?: string;
  titleProps?: Omit<TypographyProps, 'children'>;
  description?: string;
  descriptionProps?: Omit<TypographyProps, 'children'>;
  subDescription?: string;
  subDescriptionProps?: Omit<TypographyProps, 'children'>;
  showArrowIcon?: boolean;
  maskTitle?: boolean;
  showTitleRightIcon?: boolean;
  maskLength?: number;
  disabled?: boolean;
  blocked?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  pressWithBackground?: boolean;

  arrowIconProps?: IconProps;

  // Used for when type is icon or card or icon-on-bg
  iconName?: IIcons;
  titleRightIconName?: IIcons;
  rightArrowIconName?: IIcons;
  iconProps?: Omit<IconProps, 'name'>;
  // Used for when type is avatar or image
  source?: ImageSourcePropType;
  imageProps?: ImageProps;
  titleRightIconNameProps?: IconProps;
  // Used for when type is card or image
  currency?: string;
  currencyAsIcon?: string;
  // Used for when type is image
  amount?: number;

  onPress?: (event: GestureResponderEvent) => void;
  onIconPress?: () => void;

  renderRightSection?: () => ReactNode;
  renderRightContent?: () => ReactNode;

  avatarBackgroundColor?: IColor;
  avatarBorderColor?: IColor;

  pointerEvents?: 'auto' | 'box-none' | 'none' | 'box-only' | undefined;

  avatarProps?: AvatarProps;
}

const Cell: FC<CellProps> = ({
  type,
  title,
  maskTitle,
  maskLength = 4,
  description,
  subDescription,
  subDescriptionProps,
  iconName,
  rightArrowIconName = 'ChevronRight',
  showArrowIcon = true,
  showTitleRightIcon = false,
  titleRightIconName,
  titleRightIconNameProps,
  source = undefined,
  currency,
  amount,
  disabled,
  arrowIconProps,
  iconProps,
  containerStyles = {},
  currencyAsIcon = '',
  pressWithBackground = true,
  onPress,
  renderRightSection,
  renderRightContent,
  titleProps,
  descriptionProps,
  onIconPress,
  imageProps,
  avatarBackgroundColor = 'surface_secondary',
  avatarBorderColor = 'surface_stroke',
  blocked,
  pointerEvents = undefined,
  avatarProps,
}) => {
  const {color} = useContext(ThemeContext);

  const getAvatarRadius = useMemo(() => {
    switch (type) {
      case 'card':
        return 8;
      case 'icon-on-bg':
        return 12;
      case 'image':
        return 12;
      case 'avatar':
        return 50;
      default:
        return 8;
    }
  }, [type]);

  return (
    <Pressable
      pointerEvents={pointerEvents}
      disabled={disabled}
      style={({pressed}) => [
        cellStyles({color, pressed, pressWithBackground, disabled, blocked})
          .container,
        containerStyles,
      ]}
      onPress={onPress}>
      <View style={cellStyles({}).left}>
        <View>
          {iconName && type === 'icon' && (
            <Icon name={iconName} color="icon_tertiary" {...iconProps} />
          )}

          {type !== 'icon' && (
            <Avatar
              size="medium"
              borderColor={avatarBorderColor}
              backgroundColor={avatarBackgroundColor}
              iconName={iconName}
              iconProps={iconProps}
              title={currencyAsIcon}
              iconColor="icon_tertiary"
              source={source}
              borderRadius={getAvatarRadius}
              imageProps={imageProps}
              {...avatarProps}
            />
          )}
        </View>

        <View style={cellStyles({}).content}>
          <View
            style={showTitleRightIcon ? cellStyles({}).titleContainer : null}>
            <Typography
              numberOfLines={1}
              textStyles={cellStyles({}).titleTextStyle}
              {...titleProps}>
              {maskTitle ? maskedValue(title || '', maskLength) : title}{' '}
              {currency}
            </Typography>

            {showTitleRightIcon && titleRightIconName ? (
              <Icon
                name={titleRightIconName}
                color={'icon_secondary'}
                width={14}
                height={14}
                style={cellStyles({}).titleIcon}
                {...titleRightIconNameProps}
              />
            ) : null}
          </View>

          {description && (
            <Typography
              numberOfLines={1}
              type="caption"
              textColor="text_secondary"
              textStyles={cellStyles({}).description}
              {...descriptionProps}>
              {description}
            </Typography>
          )}

          {subDescription && (
            <Typography
              numberOfLines={1}
              type="caption"
              textStyles={cellStyles({}).status}
              {...subDescriptionProps}>
              {subDescription}
            </Typography>
          )}
        </View>
      </View>

      <View style={cellStyles({type}).right}>
        {amount && type === 'image' && (
          <Typography>
            {formatNumberWithSpaces(amount)} {currency}
          </Typography>
        )}

        {renderRightContent && renderRightContent()}

        {showArrowIcon && type !== 'image' ? (
          <Pressable
            pointerEvents={onIconPress ? 'box-only' : 'none'}
            onPress={onIconPress}>
            <Icon
              name={rightArrowIconName}
              color="icon_secondary"
              {...arrowIconProps}
            />
          </Pressable>
        ) : (
          renderRightSection?.()
        )}
      </View>
    </Pressable>
  );
};

export default Cell;
