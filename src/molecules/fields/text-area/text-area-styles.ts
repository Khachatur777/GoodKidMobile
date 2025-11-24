import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';
import {getFontFamily} from 'utils';
import {TextAreaProps} from './TextArea';

export const textAreaStyles = ({
  color,
  size,
  focused = false,
  error = false,
  type = 'primary',
  readOnly = false,
}: Partial<TextAreaProps> & {color?: IGetColor; focused?: boolean}) => {
  const areaSharedStyles = {
    paddingTop: 8,
    paddingLeft: 12,
    borderWidth: !readOnly ? 1 : 0,
    borderRadius: 12,
    borderColor: !error
      ? color?.(focused ? 'controls_border_focus' : 'controls_border_default')
      : color?.('accent_negative'),
    backgroundColor: readOnly
      ? color?.(
          type === 'primary'
            ? 'controls_disabled_primary'
            : 'controls_disabled_secondary',
        )
      : color?.('surface_primary', type === 'primary' ? 0 : 1),
  };

  return StyleSheet.create({
    container: {
      width: '100%',
      flexShrink: 1,
    },
    input: {
      color: color?.('text_primary'),
      ...getFontFamily('NotoSans', 'Regular'),
      fontSize: 16,
      lineHeight: 22,
    },
    largeArea: {
      flexShrink: 1,
      position: 'relative',
      ...(size === 'large'
        ? {
            height: 110,
            paddingBottom: 6,
            paddingRight: 48,
            ...areaSharedStyles,
          }
        : {}),
    },
    smallArea: {
      flexShrink: 1,
      ...(size === 'small'
        ? {
            height: 88,
            paddingBottom: 7,
            paddingRight: 32,
            ...areaSharedStyles,
          }
        : {}),
    },
    explanation: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    clearBtn: {
      position: 'absolute',
      zIndex: 999,
      right: size === 'large' ? 28 : 12,
      top: size === 'large' ? 34 : 37,
    },
    shape: {
      position: 'absolute',
      bottom: 4,
      right: 4,
    },
  });
};
