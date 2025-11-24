import {Icon, Typography} from 'molecules';
import {IIcons} from 'assets';
import {FC, useContext, useMemo} from 'react';
import {GestureResponderEvent, Pressable} from 'react-native';
import {IColor, ThemeContext} from 'theme';
import {badgeStyles} from './badge-styles';

export type BadgeSizeType = 'small' | 'medium' | 'large';

export type BadgeVariantType = 'primary' | 'secondary' | 'inverted';

export interface BadgeProps {
  iconName?: IIcons;
  rightIconName?: IIcons;
  variant?: BadgeVariantType;
  size?: BadgeSizeType;
  title: string;
  badgeColor?: IColor;
  backgroundColor?: IColor;
  borderWidth?: number;
  disabled?: boolean;
  borderColor?: IColor;
  onPress?: (event: GestureResponderEvent) => void;
}

const Badge: FC<BadgeProps> = ({
                                 size = 'medium',
                                 variant = 'primary',
                                 iconName,
                                 rightIconName,
                                 badgeColor,
                                 title,
                                 onPress,
                                 disabled = false,
                                 ...props
                               }) => {
  const {color} = useContext(ThemeContext);

  const getTitleSizes = useMemo(() => {
    switch (size) {
      case 'small':
        return 'caption';
      case 'medium':
        return 'bodyS';
      case 'large':
        return 'body';
      default:
        break;
    }
  }, [size]);

  const getColor = useMemo(() => {
    switch (variant) {
      case 'primary':
        return 'text_secondary';
      case 'secondary':
        return 'text_secondary';
      case 'inverted':
        return 'text_inverted';
      default:
        break;
    }
  }, [variant]);

  const getIconSizes = useMemo(() => {
    switch (size) {
      case 'large':
        return {
          width: 24,
          height: 24,
        };
      case 'medium':
        return {
          width: 20,
          height: 20,
        };
      case 'small':
        return {
          width: 16,
          height: 16,
        };
      default:
        break;
    }
  }, [size]);
  return (
    <Pressable
      onPress={onPress}
      style={badgeStyles({size, variant, color, ...props}).container}>
      {iconName ? (
        <Icon
          width={getIconSizes?.width}
          height={getIconSizes?.height}
          name={iconName}
          color={badgeColor || getColor}
        />
      ) : null}

      <Typography type={getTitleSizes} textColor={badgeColor || getColor}>
        {title}
      </Typography>

      {rightIconName ? (
        <Icon
          width={getIconSizes?.width}
          height={getIconSizes?.height}
          name={rightIconName}
          color={badgeColor || getColor}
        />
      ) : null}
    </Pressable>
  );
};

export default Badge;
