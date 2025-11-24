import {useAnimatedShake} from 'hooks';
import {Icon, Spacing, Typography} from 'molecules';
import {Dispatch, FC, SetStateAction, useCallback, useContext, useEffect, useState} from 'react';
import {AppState, Pressable, StyleProp, Vibration, View, ViewStyle} from 'react-native';
import Animated from 'react-native-reanimated';
import {ThemeContext} from 'theme';
import {pinFieldStyles} from './pin-field-styles';

export interface PinFieldProps {
  title?: string;
  errorMessage?: string;
  length?: number;
  hasBiometrics?: boolean;
  pinValidationError?: boolean;
  confirmPin?: boolean;
  onChange?: (pin: string, confirmPin: string) => void;
  onEndEditing?: (pin: string) => void;
  onConfirmEndEditing?: (pin: string, confirmPin: string) => void;
  onBiometric?: () => void;
  hasError?: boolean;
  setHasError?: Dispatch<SetStateAction<boolean>>;
  containerStyles?: StyleProp<ViewStyle>;
  code: string;
  setCode: Dispatch<SetStateAction<string>>;
  confirmCode?: string;
  setConfirmCode?: Dispatch<SetStateAction<string>>;
}

const PinField: FC<PinFieldProps> = ({
                                       title = '',
                                       errorMessage = '',
                                       length = 4,
                                       pinValidationError = false,
                                       confirmPin = false,
                                       hasError = false,
                                       containerStyles = {},
                                       onChange,
                                       onEndEditing,
                                       onConfirmEndEditing,
                                       setHasError,
                                       code = '',
                                       setCode,
                                       confirmCode = '',
                                       setConfirmCode,
                                     }) => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        setError(false);
        setCode('');
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const {rStyle, shake} = useAnimatedShake({
    duration: 60,
    repeatCount: 6,
    translationAmount: 20,
  });
  const {color} = useContext(ThemeContext);

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const circlesArray = new Array(length).fill(0);
  const isPinFilled = code.length === length;
  const isDisabled = confirmPin
    ? confirmCode.length === length
    : code.length === length;
  const isCodeExists = code.length > 0;

  useEffect(() => {
    if (isPinFilled) {
      onEndEditing?.(code);
    }
  }, [isPinFilled, code]);

  useEffect(() => {
    if (!confirmPin) return;

    if (code.length === confirmCode.length && code !== confirmCode) {
      Vibration.vibrate();
      setError(true);
      setConfirmCode?.('');
      onChange?.(code, '');
      shake();
    } else if (
      code.length &&
      code.length === confirmCode.length &&
      code === confirmCode
    ) {
      onChange?.(code, confirmCode);
      onConfirmEndEditing?.(code, confirmCode);
    }
  }, [code, confirmCode, confirmPin]);

  useEffect(() => {
    if (hasError) {
      Vibration.vibrate();
      setError(true);
      setCode('');
      onChange?.('', '');
      setHasError?.(false);
      shake();
    }
  }, [hasError]);

  useEffect(() => {
    if (isCodeExists) {
      setError(false);
    }
  }, [isCodeExists]);

  useEffect(() => {
    if (pinValidationError && code.length === 4) {
      Vibration.vibrate();
      setError(true);
      shake();
    }
  }, [pinValidationError, code]);

  const onKeyPress = useCallback(
    (key: string | number) => {
      if (!Number.isNaN(parseInt(key as string, 10))) {
        if (confirmPin && code.length === length && !pinValidationError) {
          setError(false);
          setConfirmCode?.(confirmCode + key);
        } else if (!pinValidationError) {
          setCode(code + key);
          onChange?.(code + key, '');
        }
      } else if (key === 'backspace') {
        if (pinValidationError) {
          setCode('');
          setError(false);
        }

        if (confirmPin && code.length === length) {
          setConfirmCode?.(confirmCode.slice(0, -1));
          onChange?.(code, confirmCode.slice(0, -1));
        } else {
          setCode(code.slice(0, -1));
          onChange?.(code.slice(0, -1), '');
        }
      } else if (key === 'biometric') {
      }
    },
    [
      code,
      confirmCode,
      confirmPin,
      length,
      error,
      setConfirmCode,
      setCode,
      pinValidationError,
    ],
  );

  return (
    <View style={[pinFieldStyles({}).container, containerStyles]}>
      <View style={pinFieldStyles({}).top}>
        <Typography>{title || ' '}</Typography>

        <Spacing size={24}/>

        <View style={pinFieldStyles({}).circlesContainer}>
          {circlesArray.map((_, i) => (
            <Animated.View
              key={`CircleKey--${i}`}
              style={[
                rStyle,
                pinFieldStyles({
                  isCircleActive:
                    confirmPin && code.length === length
                      ? confirmCode.length > i
                      : code.length > i,
                  error,
                  color,
                }).circle,
              ]}></Animated.View>
          ))}
        </View>

        <Spacing size={16}/>

        <Typography type="bodyS" textColor="text_negative">
          {error && errorMessage ? errorMessage : ' '}
        </Typography>
      </View>

      <View style={pinFieldStyles({}).numbersContainer}>
        {numbers.map(number => (
          <Pressable
            disabled={isDisabled}
            key={number}
            onPress={() => onKeyPress(number)}
            style={[pinFieldStyles({color}).number]}>
            <Typography type="titleXLMedium">{number}</Typography>
          </Pressable>
        ))}

        <View
          style={pinFieldStyles({}).number}/>

        <Pressable
          disabled={isDisabled}
          onPress={() => onKeyPress(0)}
          style={pinFieldStyles({color}).number}>
          <Typography type="titleXLMedium">0</Typography>
        </Pressable>

        <Pressable
          onPress={() => {
            onKeyPress('backspace');
          }}
          style={[pinFieldStyles({}).number]}>
          <Icon
            name={'BackspaceIcon'}
            width={40}
            height={40}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default PinField;
