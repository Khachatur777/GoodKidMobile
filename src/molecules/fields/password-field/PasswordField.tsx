import {useFocusEffect} from '@react-navigation/native';
import {ForwardedRef, forwardRef, useCallback, useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleProp,
  TextInput,
  TextInputFocusEventData, View, ViewStyle,
} from 'react-native';
import {TextField, TextFieldProps} from 'molecules';
import {IIcons} from 'assets';

export interface PasswordFiledProps extends TextFieldProps {
  isVisible?: boolean;
  showCleanBtn?: boolean;
  // The wrapper insets the field by 20 on each side by default. On screens where
  // ordinary fields sit next to it that shows, so the inset is overridden there.
  wrapperStyles?: StyleProp<ViewStyle>;
}

const PasswordField = forwardRef(
  (
    {isVisible = false, showCleanBtn = false, wrapperStyles, ...props}: PasswordFiledProps,
    ref: ForwardedRef<TextInput>,
  ) => {
    const [visible, setVisible] = useState<boolean>(isVisible);
    const [focused, setFocused] = useState<boolean>(false);

    useFocusEffect(useCallback(() => setVisible(isVisible), [isVisible]));

    const onPress = useCallback(() => {
      setVisible(val => !val);
    }, []);


    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        props?.onBlur?.(e);
        setFocused(false);
      },
      [props],
    );
    const onFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        props?.onFocus?.(e);
        setFocused(true);
      },
      [props],
    );

    // Wrappers for AnimatedTextInput compatibility
    const handleFocus = useCallback(
      (e: any) => {
        props?.onFocus?.(e);
        setFocused(true);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: any) => {
        props?.onBlur?.(e);
        setFocused(false);
      },
      [onBlur],
    );

    return (
      <View style={[{paddingHorizontal: 20}, wrapperStyles]}>
        <TextField
          ref={ref}
          {...props}
          secureTextEntry={!visible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          endIcons={
            [
              {
                name: visible ? 'EyeCloseIcon' as IIcons : 'EyeOpenIcon' as IIcons,
                disabled: false,
                onPress,
              },
            ]

          }
        />
      </View>

    );
  },
);

export default PasswordField;
