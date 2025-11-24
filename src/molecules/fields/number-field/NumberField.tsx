import {TextField, TextFieldProps} from 'molecules';
import {ForwardedRef, forwardRef, useCallback, useEffect} from 'react';
import {TextInput, NativeSyntheticEvent, TextInputFocusEventData} from 'react-native';
import {onNumberFormatter, onNumberSerializer} from 'utils';

export type NumberFieldValueT = {
  formatted: string;
  serialized: number;
};

export interface NumberFieldProps
  extends Omit<TextFieldProps, 'onChangeText' | 'value'> {
  onChangeText?: (value: NumberFieldValueT) => void;
  decimals?: 0 | 1 | 2 | 4;
  currency?: string;
  value?: NumberFieldValueT;
  explanationPadding?: number;
  onFocus?: (e:  NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e:  NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

const NumberField = forwardRef(
  (
    {
      onChangeText,
      decimals = 2,
      value = {formatted: '', serialized: 0},
      currency = '',
      keyboardType = 'numeric',
      explanationPadding = 6,
      onBlur,
      onFocus,
      ...props
    }: NumberFieldProps,
    ref: ForwardedRef<TextInput>,
  ) => {
    const onNumberFieldChange = useCallback(
      (inputValue: string) => {
        if (inputValue.split('.').length > 2) {
          return; // Prevent adding another decimal point
        }

        if (
          (inputValue.split('.').length > 1 &&
            inputValue[inputValue.length - 1]) === ','
        ) {
          return;
        }

        const serializedValue = onNumberSerializer(inputValue, '');
        const formattedValue = onNumberFormatter(serializedValue, decimals, '');

        onChangeText?.({
          formatted: formattedValue,
          serialized: Number(formattedValue.replace(/,/g, '')),
        });
      },
      [decimals, onChangeText],
    );

    const handleBlur = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onBlur?.(e);
      if (currency !== 'AMD') {
        if (value?.formatted.endsWith('.')) {
          onNumberFieldChange(value.formatted + '0'.repeat(decimals));
        } else if (!value?.formatted.includes('.') && value?.formatted) {
          onNumberFieldChange(value.formatted + '.' + '0'.repeat(decimals));
        } else if (value?.formatted.split('.')[1]?.length < decimals) {
          const missingZeros = decimals - value.formatted.split('.')[1].length;
          onNumberFieldChange(value.formatted + '0'.repeat(missingZeros));
        }
      }
    }, [value, decimals, onNumberFieldChange, currency]);

    const handleFocus = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onFocus?.(e);
      if (value?.formatted.endsWith('.00') || value?.formatted.endsWith('.0')) {
        onNumberFieldChange(value.formatted.replace(/\.[0]+$/, ''));
      }
    }, [value, onNumberFieldChange]);

    useEffect(() => {
      onNumberFieldChange(value.formatted);
    }, [decimals]);

    return (
      <TextField
        returnKeyType="done"
        {...props}
        ref={ref}
        keyboardType={keyboardType}
        maxLength={18}
        currency={currency}
        value={value?.formatted}
        onChangeText={onNumberFieldChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        explanationPadding={explanationPadding}
      />
    );
  },
);

export default NumberField;
