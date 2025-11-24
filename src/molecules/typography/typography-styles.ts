import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';
import {getFontFamily} from 'utils';
import {TypographyProps} from 'molecules';

export const typographyStyles = ({
  color,
  textColor = 'text_primary',
  alignment = undefined,
}: Partial<TypographyProps> & {color?: IGetColor}) =>
  StyleSheet.create({
    color: {
      color: color?.(textColor),
      textAlign: alignment,
    },
    bodyL: {
      ...getFontFamily('NotoSans', 'Regular'),
      fontSize: 18,
      lineHeight: 24,
    },
    body: {
      ...getFontFamily('NotoSans', 'Regular'),
      fontSize: 16,
      lineHeight: 22,
    },
    bodyS: {
      ...getFontFamily('NotoSans', 'Regular'),
      fontSize: 14,
      lineHeight: 20,
    },
    bodyM: {
      ...getFontFamily('NotoSans', 'Medium'),
      fontSize: 16,
      lineHeight: 22,
    },
    bodySM: {
      ...getFontFamily('NotoSans', 'Medium'),
      fontSize: 14,
      lineHeight: 20,
    },
    caption: {
      ...getFontFamily('NotoSans', 'Regular'),
      fontSize: 12,
      lineHeight: 16,
    },
    bodyLBold: {
      ...getFontFamily('NotoSans', 'SemiBold'),
      fontSize: 18,
      lineHeight: 24,
    },
    bodyBold: {
      ...getFontFamily('NotoSans', 'SemiBold'),
      fontSize: 16,
      lineHeight: 22,
    },
    bodySBold: {
      ...getFontFamily('NotoSans', 'SemiBold'),
      fontSize: 14,
      lineHeight: 20,
    },
    captionBold: {
      ...getFontFamily('NotoSans', 'SemiBold'),
      fontSize: 12,
      lineHeight: 16,
    },
    titleXL: {
      ...getFontFamily('Montserrat', 'SemiBold'),
      fontSize: 36,
      lineHeight: 42,
    },
    titleXLMedium: {
      ...getFontFamily('Montserrat', 'Medium'),
      fontSize: 36,
      lineHeight: 42,
    },
    titleL: {
      ...getFontFamily('Montserrat', 'SemiBold'),
      fontSize: 30,
      lineHeight: 38,
    },
    title1: {
      ...getFontFamily('Montserrat', 'SemiBold'),
      fontSize: 24,
      lineHeight: 30,
    },
    title2: {
      ...getFontFamily('Montserrat', 'SemiBold'),
      fontSize: 20,
      lineHeight: 26,
    },
    title3: {
      ...getFontFamily('Montserrat', 'SemiBold'),
      fontSize: 18,
      lineHeight: 24,
    },
    headline: {
      ...getFontFamily('Montserrat', 'SemiBold'),
      fontSize: 16,
      lineHeight: 22,
    },
    description: {
      ...getFontFamily('NotoSans', 'SemiBold'),
      fontSize: 8,
      lineHeight: 10,
    },
  });
