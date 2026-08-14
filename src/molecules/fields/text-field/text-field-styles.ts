import {Platform, StyleSheet} from 'react-native';
import {IGetColor} from 'theme';
import {getFontFamily} from 'utils';
import {TextFieldProps} from './TextField';

export const textFStyles = ({
  color,
  readOnly,
  focused,
  error,
  type,
  size,
  labelLeft,
  value,
  textWidth,
  explanationPadding,
}: Partial<TextFieldProps> & {
  color?: IGetColor;
  focused?: boolean;
  labelLeft?: number;
  textWidth?: number;
}) => {
  const sharedStyles = {
    paddingHorizontal: 16,
    borderWidth: !readOnly ? 1.5 : readOnly && error ? 1.5 : 0,
    borderRadius: size === 'small' ? 8 : 18,
    borderColor: !error
      ? color?.(focused ? 'accent_active' : 'surface_stroke')
      : color?.(
          focused && !value ? 'accent_active' : 'accent_negative',
        ),
    backgroundColor: readOnly
      ? color?.(
          type === 'primary'
            ? 'controls_disabled_primary'
            : 'controls_disabled_secondary',
        )
      : color?.('surface_primary'),
  };

  const getInputHeight = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 56;
      default:
        return 0;
    }
  };

  const getInputStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
          paddingTop: Platform.OS === 'android' ? 3 : 0,
          paddingBottom: 0,
        };
      case 'medium':
        return {
          fontSize: 16,
          paddingTop: Platform.OS === 'android' ? 3 : 0,
          paddingBottom: 0,
        };
      case 'large':
        return {
          fontSize: 16,
          paddingTop: Platform.OS === 'android' ? 3 : 0,
          paddingBottom: 0,
        };
      default:
        return {};
    }
  };

  return StyleSheet.create({
    container: {
      flexShrink: 1,
    },
    fieldInnerContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      flexShrink: 1,
      height: getInputHeight(),
      ...sharedStyles,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      width: '90%',
    },
    currencyText: {
      marginTop: size === 'large' ? 23 : 0,
      marginLeft: 5,
    },
    explanationPadding: {
      paddingBottom: explanationPadding,
    },
    input: {
      width: '100%',
      height: '90%',
      flexShrink: 1,
      color:
        readOnly && error
          ? color?.('accent_negative')
          : color?.('text_primary'),
      ...getFontFamily('NotoSans', 'Regular'),
      paddingLeft: 0,
      ...getInputStyles(),
    },
    leftIconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingRight: 8,
    },
    rightIconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingLeft: 8,
      height: '100%',
    },
    endIconBtn: {
      height: '100%',
      paddingHorizontal: 2,
      justifyContent: 'center',
    },
    labelContainer: {
      position: 'absolute',
      left: labelLeft,
    },
    prefix: {
      paddingRight: 4,
      paddingTop: Platform.OS === 'android' ? 2 : -1,
    },
    fakeInput: {
      paddingRight: 4,
      paddingTop:
        size !== 'small' ? 1.8 : Platform.OS === 'android' ? 2.2 : 1.2,
      maxWidth: '80%',
    },
    currency: {
      position: 'absolute',
      top: size === 'small' ? 0 : 19.8,
      left: textWidth!,
      paddingTop: 8,
    },
  });
};
