import {FC, ReactNode, useContext} from 'react';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';
import {IColor, ThemeContext} from 'theme';
import {typographyStyles} from './typography-styles';

export type TypographyType =
  | 'bodyL'
  | 'body'
  | 'bodyS'
  | 'caption'
  | 'bodyLBold'
  | 'bodyBold'
  | 'bodySBold'
  | 'bodyM'
  | 'bodySM'
  | 'captionBold'
  | 'titleXL'
  | 'titleXLMedium'
  | 'titleL'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'headline'
  | 'description';

export interface TypographyProps extends TextProps {
  children: string | ReactNode;
  type?: TypographyType;
  textColor?: IColor;
  textStyles?: StyleProp<TextStyle>;
  alignment?: undefined | 'auto' | 'left' | 'right' | 'center' | 'justify';
}

const Typography: FC<TypographyProps> = ({
  children,
  type = 'body',
  textStyles,
  ...props
}) => {
  const {color} = useContext(ThemeContext);

  return (
    <Text
      {...props}
      style={[
        typographyStyles({...props})[type],
        typographyStyles({color, ...props}).color,
        textStyles,
      ]}>
      {children}
    </Text>
  );
};

export default Typography;
