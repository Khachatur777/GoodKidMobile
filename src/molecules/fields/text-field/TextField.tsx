import {useIsFocused} from '@react-navigation/native';
import {Icon, IconProps, Spacing, Typography, TypographyProps} from 'molecules';
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleProp,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextInputSubmitEditingEventData,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useFocus} from 'rtk';
import {ThemeContext} from 'theme';
import {textFStyles} from './text-field-styles';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export interface TextFieldProps extends TextInputProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'primary' | 'secondary';
  explanation?: string;
  hideExplanationSpace?: boolean;
  label?: string;
  disableNextInputFocus?: boolean;
  currency?: string;
  error?: boolean;
  startIcons?: (IconProps & {onPress?: () => void; disabled?: boolean})[];
  endIcons?: (IconProps & {onPress?: () => void; disabled?: boolean})[];
  prefix?: string;
  prefixProps?: Omit<TypographyProps, 'children'>;
  focusedPrefix?: boolean;
  isAnimationInputKey?: boolean;
  fakeInput?: ReactNode;
  containerStyles?: StyleProp<ViewStyle>;
  renderEndContent?: () => ReactNode;
  disableAnimation?: boolean;
  renderLeftContent?: () => ReactNode;
  explanationPadding?: number;
}

const TextField = forwardRef(
  (
    {
      size = 'small',
      label = '',
      explanation = '',
      currency = '',
      startIcons = [],
      endIcons = [],
      type = 'primary',
      prefix = '',
      prefixProps = {},
      disableNextInputFocus = false,
      hideExplanationSpace = false,
      isAnimationInputKey = false,
      error = false,
      fakeInput,
      containerStyles = {},
      renderEndContent,
      disableAnimation = false,
      renderLeftContent = undefined,
      focusedPrefix = false,
      explanationPadding = 0,
      ...props
    }: TextFieldProps,
    ref: ForwardedRef<TextInput>,
  ) => {
    const [focused, setFocused] = useState<boolean>(false);
    const isFocused = useIsFocused();

    /* @ts-expect-error */
    const {register, unregister, focusNext} = useFocus();
    const {color, theme} = useContext(ThemeContext);
    const reference = useRef<TextInput>(null);

    useEffect(() => {
      register(reference.current);
      return () => {
        unregister(reference.current);
      };
    }, [register, unregister]);

    // Use ref outside the TextInput Component
    useImperativeHandle(ref, () => reference.current as TextInput);

    const iconSize = useMemo(() => (size === 'small' ? 20 : 24), [size]);
    const labelLeftSize = useMemo(
      () =>
        startIcons.length > 1
          ? startIcons.length * 24 + (startIcons.length - 1) * 8 + 20
          : 44,
      [startIcons],
    );

    // #region Input Animation Styles
    const labelAnimation = useSharedValue(18);
    const inputAnimation = useSharedValue(0);

    const labelAnimationStyle = useAnimatedStyle(() => {
      if (disableAnimation) return {};
      return {
        top: withTiming(labelAnimation.value, {
          duration: 200,
        }),
      };
    });
    const inputAnimationStyle = useAnimatedStyle(() => {
      if (disableAnimation) return {};
      return {
        top: withTiming(inputAnimation.value, {
          duration: 200,
        }),
      };
    });
    // #endregion Input Animation Styles

    // When input field has value it should be on focused state
    // Prevent rendering in every keydown
    const hasValue = !!props?.value;
    useEffect(() => {
      if (hasValue && size === 'large') {
        setFocused(true);
        labelAnimation.value = 6;
        inputAnimation.value = 11;
      } else {
        setFocused(false);
        labelAnimation.value = 18;

        inputAnimation.value = 0;
      }
    }, [hasValue, size, labelLeftSize]);

    useEffect(() => {
      // Set Input Cursor Position To The End Of Input
      if (isFocused && reference.current && Platform.OS === 'android') {
        setTimeout(() => {
          reference.current?.setNativeProps({
            text: props.value,
          });
        }, 10);
      }
    }, [isFocused, props.value]);

    // Controlling Styles When Input Field Is Focused
    const onFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(true);
        props?.onFocus?.(e);

        if (size === 'large') {
          labelAnimation.value = 6;

          inputAnimation.value = 11;
        }
      },
      [props, size, labelLeftSize],
    );

    // Controlling Styles When Input Field Is Blurred
    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(false);
        props?.onBlur?.(e);

        if (!props.value && size === 'large') {
          labelAnimation.value = 18;

          inputAnimation.value = 0;
        } else if (props.value && size === 'large') {
          setFocused(true);
          labelAnimation.value = 6;
          inputAnimation.value = 11;
        }
      },
      [props, size, labelLeftSize],
    );

    const onSubmitEditing = useCallback(
      (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        if (!disableNextInputFocus) {
          focusNext(reference.current);
          props.onSubmitEditing?.(e);
        } else {
          props.onSubmitEditing?.(e);
        }
      },
      [disableNextInputFocus],
    );

    const renderStartIcons = useMemo(
      () =>
        startIcons.length > 0 ? (
          <View style={textFStyles({}).leftIconsContainer}>
            {startIcons.map(
              ({name, onPress, disabled = false, ...props}, _) => (
                <Pressable
                  disabled={disabled}
                  onPress={onPress}
                  key={`Icon-${name + _}`}>
                  <Icon
                    color="icon_tertiary"
                    name={name}
                    width={iconSize}
                    height={iconSize}
                    {...props}
                  />
                </Pressable>
              ),
            )}
          </View>
        ) : null,
      [startIcons, iconSize],
    );

    const renderEndIcons = useMemo(
      () =>
        endIcons.length > 0 ? (
          <View style={textFStyles({}).rightIconsContainer}>
            {endIcons.map(({name, onPress, disabled = false, ...props}, _) => (
              <Pressable
                disabled={disabled}
                onPress={onPress}
                key={`Icon-${name + _}`}
                style={textFStyles({}).endIconBtn}>
                <Icon
                  color="icon_tertiary"
                  name={name}
                  width={iconSize}
                  height={iconSize}
                  {...props}
                />
              </Pressable>
            ))}
          </View>
        ) : null,
      [endIcons, iconSize],
    );

    const renderEndContentInner = useMemo(
      () =>
        renderEndContent ? (
          <View style={textFStyles({}).rightIconsContainer}>
            {renderEndContent()}
          </View>
        ) : null,
      [endIcons, iconSize],
    );

    const renderPrefix = useMemo(
      () =>
        prefix ? (
          <Animated.View
            style={[
              textFStyles({size}).prefix,
              size === 'large' ? inputAnimationStyle : {},
            ]}>
            <Typography
              textColor="text_secondary"
              type={size === 'small' ? 'bodyS' : 'body'}
              {...prefixProps}>
              {focusedPrefix ? prefix : size === 'large' && focused && prefix}
              {size !== 'large' && prefix}
            </Typography>
          </Animated.View>
        ) : null,
      [prefix, focused, size, inputAnimationStyle, focusedPrefix, prefixProps],
    );
    const renderFakeInput = useMemo(
      () =>
        fakeInput ? (
          <Animated.View
            style={[
              textFStyles({size}).fakeInput,
              size === 'large' ? inputAnimationStyle : {},
            ]}>
            {fakeInput}
          </Animated.View>
        ) : null,
      [fakeInput, size, inputAnimationStyle],
    );

    return (
      <Pressable
        style={textFStyles({}).container}
        onPress={() => {
          if (reference.current) {
            reference.current.focus();
          }
        }}
        pointerEvents={props?.editable === false ? 'none' : 'box-none'}>
        {size !== 'large' && (
          <Typography textColor="text_secondary" type="bodyS">
            {label}
          </Typography>
        )}
        <Spacing size={4} />

        <View
          style={[
            textFStyles({
              color,
              size,
              type,
              focused,
              error,
              readOnly: props?.readOnly,
              value: props?.value,
            }).fieldInnerContainer,
            containerStyles,
          ]}>
          {renderLeftContent?.()}

          {size === 'large' && (
            <Animated.View
              key={`label-${Math.random() * 0.01}`}
              style={[
                textFStyles({
                  labelLeft: startIcons?.length ? labelLeftSize : 12,
                }).labelContainer,
                labelAnimationStyle,
              ]}>
              <Typography textColor="text_secondary" type="bodyS">
                {label}
              </Typography>
            </Animated.View>
          )}

          {renderPrefix}

          {renderStartIcons}

          {renderFakeInput}

          <View style={textFStyles({}).inputContainer}>
            {/* We checked if the screen is focused then add text input */}
            {/* This is made for preventing double keyboard open and close when swipe back on ios  */}
            {isFocused ? (
              <AnimatedTextInput
                key={
                  isAnimationInputKey
                    ? `label-${Math.random() * 0.01}`
                    : undefined
                }
                {...props}
                placeholderTextColor={color(
                  focused ? 'text_tertiary' : 'text_secondary',
                )}
                placeholder={
                  !focused && size === 'large' ? '' : props.placeholder
                }
                style={[
                  textFStyles({
                    color,
                    size,
                    focused,
                    readOnly: props?.readOnly,
                    error,
                  }).input,
                  size === 'large' ? inputAnimationStyle : {},
                  currency ? {width: null} : null,
                ]}
                ref={reference}
                onFocus={onFocus as any}
                onBlur={onBlur as any}
                onSubmitEditing={onSubmitEditing}
                keyboardAppearance={theme === 'dark' ? 'dark' : 'light'}
              />
            ) : null}

            {props.value && currency ? (
              <Typography
                textStyles={textFStyles({size}).currencyText}
                textColor={
                  props?.readOnly && error ? 'accent_negative' : 'text_primary'
                }>
                {currency}
              </Typography>
            ) : null}
          </View>

          {renderEndIcons}

          {renderEndContentInner}
        </View>

        {hideExplanationSpace ? null : (
          <>
            <Spacing size={4} />

            <Typography
              textStyles={textFStyles({explanationPadding}).explanationPadding}
              textColor={error ? 'text_negative' : 'text_secondary'}
              type="bodyS">
              {explanation}
            </Typography>
          </>
        )}
      </Pressable>
    );
  },
);

export default TextField;
