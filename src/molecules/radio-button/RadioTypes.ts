import {TypographyProps} from 'molecules';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {IColor} from 'theme';

export type RadioButtonProps = {
  accessibilityLabel?: string;
  inactiveBorderColor?: IColor;
  activeBorderColor?: IColor;
  inactiveBackgroundColor?: IColor;
  activeBackgroundColor?: IColor;
  isBackgroundTransparent?: boolean;
  borderSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  description?: string;
  descriptionStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  id: string;
  key?: string;
  label?: string;
  labelProps?: TypographyProps;
  labelStyle?: StyleProp<TextStyle>;
  layout?: 'row' | 'column';
  onPress?: (id: string) => void;
  selected?: boolean;
  size?: 'small' | 'medium' | 'large';
  testID?: string;
  value?: string;
  error?: boolean;
  pointerEvents?: 'auto' | 'box-none' | 'none' | 'box-only' | undefined;
};

export type RadioGroupProps = {
  childrenMode?: 'children' | 'prop';
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  layout?: 'row' | 'column';
  onPress?: (selectedId: string) => void;
  radioButtons?: RadioButtonProps[];
  children?: any;
  selectedId?: string;
  testID?: string;
};
