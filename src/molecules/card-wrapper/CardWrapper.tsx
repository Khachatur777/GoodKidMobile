import {FC, ReactNode, useContext} from 'react';
import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import {IColor, ThemeContext} from 'theme';
import {cardWrapperStyles} from './card-wrapper-styles';
import {Icon, IconProps, Typography, TypographyProps} from 'molecules';
import {IIcons} from 'assets';

export interface CardWrapperProps {
  children: ReactNode;
  backgroundColor?: IColor;
  borderColor?: IColor;
  backgroundColorOpacity?: number;
  radius?: number;
  containerStyles?: StyleProp<ViewStyle>;
  headerBtnStyles?: StyleProp<ViewStyle>;
  subtitleContainerStyles?: StyleProp<ViewStyle>;
  // Default is shadow
  type?: 'shadow' | 'outline' | 'default';
  title?: string;
  subTitle?: string;
  rightIconColor?: IColor;
  subTitleProps?: TypographyProps;
  rightIconProps?: IconProps;
  titleProps?: Omit<TypographyProps, 'children'>;
  headerPaddingLeft?: number;
  headerPaddingRight?: number;
  renderExtraElements?: () => ReactNode;
  renderRightSection?: () => ReactNode;
  onPress?: () => void;
  showArrowBtn?: boolean;
  disabled?: boolean;
  rightIconName?: IIcons;
}

const CardWrapper: FC<CardWrapperProps> = ({
  children,
  containerStyles,
  type = 'shadow',
  title,
  renderExtraElements,
  renderRightSection,
  onPress,
  showArrowBtn = true,
  titleProps,
  subTitle,
  subTitleProps,
  headerBtnStyles,
  rightIconProps,
  rightIconColor = 'icon_primary',
  subtitleContainerStyles,
  disabled = false,
  rightIconName = 'ChevronRight',
  ...props
}) => {
  const {color} = useContext(ThemeContext);

  return (
    <View
      pointerEvents={disabled ? 'none' : 'auto'}
      style={[
        cardWrapperStyles({color, ...props}).container,
        cardWrapperStyles({color, ...props})[type],
        containerStyles,
      ]}>
      {title ? (
        <View style={cardWrapperStyles({...props}).header}>
          <View style={cardWrapperStyles({}).titleContainer}>
            <Typography type="title3" numberOfLines={1} {...titleProps}>
              {title}
            </Typography>

            {renderExtraElements?.()}
          </View>

          {showArrowBtn && (
            <Pressable
              hitSlop={15}
              style={[cardWrapperStyles({}).headerBtn, headerBtnStyles]}
              onPress={onPress}>
              <Icon
                name={rightIconName}
                color={rightIconColor}
                {...rightIconProps}
              />
            </Pressable>
          )}

          {!showArrowBtn && renderRightSection?.()}

        </View>
      ) : null}
      {subTitle ? (
        <View
          style={[
            cardWrapperStyles({}).headerSubTitle,
            subtitleContainerStyles,
          ]}>
          <Typography
            type="caption"
            textColor={'text_secondary'}
            numberOfLines={1}
            {...subTitleProps}>
            {subTitle}
          </Typography>
        </View>
      ) : null}
      {children}
    </View>
  );
};

export default CardWrapper;
