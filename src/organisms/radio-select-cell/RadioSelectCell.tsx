import {Radio, Typography, TypographyProps} from 'molecules';
import {FC, useContext} from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {IGetColor, ThemeContext} from 'theme';

export interface RadioSelectCellProps {
  isActive?: boolean;
  title?: string;
  titleProps?: TypographyProps;
  description?: string;
  descriptionProps?: TypographyProps;
  withBackground?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  containerStyles?: StyleProp<ViewStyle>;
}

const radioSelectCellStyles = ({
  color,
  withBackground,
  isActive,
}: Partial<RadioSelectCellProps> & {
  color?: IGetColor;
}) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 56,
      backgroundColor: color?.(
        'controls_list_selected',
        isActive && withBackground ? 1 : 0,
      ),
    },
    flexShrink: {flexShrink: 1},
  });

const RadioSelectCell: FC<RadioSelectCellProps> = ({
  isActive = false,
  title = '',
  titleProps,
  description = '',
  descriptionProps,
  withBackground = false,
  onPress,
  containerStyles,
}) => {
  const {color} = useContext(ThemeContext);

  return (
    <Pressable
      pointerEvents="box-only"
      onPress={onPress}
      style={[
        radioSelectCellStyles({color, withBackground, isActive}).container,
        containerStyles,
      ]}>
      <Radio id={title} selected={isActive} />

      <View style={radioSelectCellStyles({}).flexShrink}>
        <Typography numberOfLines={2} {...titleProps}>
          {title}
        </Typography>

        {description && (
          <Typography
            type="bodyS"
            textColor="text_secondary"
            {...descriptionProps}>
            {description}
          </Typography>
        )}
      </View>
    </Pressable>
  );
};

export default RadioSelectCell;
