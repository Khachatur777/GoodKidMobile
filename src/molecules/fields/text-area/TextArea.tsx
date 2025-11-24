import {Icon, Spacing, Typography} from 'molecules';
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocus} from 'rtk';
import {ThemeContext} from 'theme';
import {textAreaStyles} from './text-area-styles';

export interface TextAreaProps extends Omit<TextInputProps, 'style'> {
  type?: 'primary' | 'secondary';
  size?: 'small' | 'large';
  label?: string;
  explanation?: string;
  count?: number;
  disableNextInputFocus?: boolean;
  onClear?: () => void;
  showClearButton?: boolean;
  error?: boolean;
}

const TextArea = forwardRef(
  (
    {
      size = 'small',
      type = 'primary',
      label = '',
      explanation = '',
      count = 0,
      disableNextInputFocus = false,
      onClear,
      showClearButton = true,
      error = false,
      ...props
    }: TextAreaProps,
    ref: ForwardedRef<TextInput>,
  ) => {
    const [focused, setFocused] = useState<boolean>(false);

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

    // Controlling Styles When Input Field Is Focused
    const onFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(true);
        props?.onFocus?.(e);
      },
      [props, size],
    );

    // Controlling Styles When Input Field Is Blurred
    const onBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setFocused(false);
        props?.onBlur?.(e);
      },
      [props, size],
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

    // Wrappers for TextInput compatibility
    const handleFocus = useCallback(
      (e: any) => {
        onFocus(e as NativeSyntheticEvent<TextInputFocusEventData>);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: any) => {
        onBlur(e as NativeSyntheticEvent<TextInputFocusEventData>);
      },
      [onBlur],
    );

    // Use ref outside the TextInput Component
    useImperativeHandle(ref, () => reference.current as TextInput);

    return (
      <View style={textAreaStyles({color, size}).container}>
        <View
          style={
            textAreaStyles({
              color,
              size,
              focused,
              type,
              error,
              readOnly: props.readOnly,
            }).largeArea
          }>
          {!props.readOnly && showClearButton && props.value && (
            <TouchableOpacity
              onPress={onClear}
              style={textAreaStyles({size}).clearBtn}>
              <Icon
                name="XCloseIcon"
                width={20}
                height={20}
                color="icon_secondary"
              />
            </TouchableOpacity>
          )}

          {!props.readOnly && (
            <View style={textAreaStyles({}).shape}>
              <Icon
                name="ShapeIcon"
                color="icon_tertiary"
                width={10}
                height={10}
              />
            </View>
          )}

          <Typography
            type={size === 'small' ? 'bodyS' : 'body'}
            textColor="text_secondary">
            {label}
          </Typography>

          {size === 'small' && <Spacing size={4} />}

          <View
            style={
              textAreaStyles({
                color,
                size,
                focused,
                type,
                error,
                readOnly: props.readOnly,
              }).smallArea
            }>
            <TextInput
              {...props}
              ref={reference}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholderTextColor={color(
                focused ? 'text_tertiary' : 'text_secondary',
              )}
              onSubmitEditing={onSubmitEditing}
              multiline
              style={textAreaStyles({color}).input}
              keyboardAppearance={theme === 'dark' ? 'dark' : 'light'}
            />
          </View>
        </View>

        <Spacing size={4} />

        <View style={textAreaStyles({}).explanation}>
          <Typography
            type={count ? 'bodyS' : 'caption'}
            textColor={error ? 'text_negative' : 'text_secondary'}>
            {explanation}
          </Typography>

          {count ? (
            <Typography
              type="bodyS"
              textColor={error ? 'text_negative' : 'text_secondary'}>
              {props?.value?.length || '0'}/{count}
            </Typography>
          ) : null}
        </View>
      </View>
    );
  },
);

export default TextArea;
