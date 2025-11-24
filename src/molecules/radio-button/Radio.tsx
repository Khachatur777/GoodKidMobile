import {Pressable, View} from 'react-native';
import {RadioButtonProps} from 'molecules';
import {radioStyles} from './radio-styles';
import {Typography} from 'molecules';
import {useCallback, useContext} from 'react';
import {ThemeContext} from 'theme';

export default function RadioButton({
  accessibilityLabel,
  inactiveBorderColor,
  activeBorderColor,
  // If you want to set inactive background from outside you need to set isBackgroundTransparent to false
  inactiveBackgroundColor,
  activeBackgroundColor,
  isBackgroundTransparent = true,
  description,
  disabled = false,
  id,
  label,
  labelProps,
  layout = 'row',
  onPress,
  selected = false,
  size = 'medium',
  error = false,
  pointerEvents = undefined,
  testID,
}: RadioButtonProps) {
  const {color} = useContext(ThemeContext);

  let orientation: any = {flexDirection: 'row'};
  let margin: any = {marginLeft: size === 'small' ? 8 : 12};

  if (layout === 'column') {
    orientation = {alignItems: 'center'};
    margin = {marginTop: size === 'small' ? 8 : 12};
  }

  function handlePress() {
    if (onPress) {
      onPress(id);
    }
  }

  const getTypographySize = useCallback(() => {
    switch (size) {
      case 'large':
        return 'bodyL';
      case 'medium':
        return 'body';
      case 'small':
        return 'bodyS';
      default:
        break;
    }
  }, [size]);

  return (
    <>
      <Pressable
        pointerEvents={pointerEvents}
        accessibilityHint={description}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityRole="radio"
        accessibilityState={{checked: selected, disabled}}
        disabled={disabled}
        onPress={handlePress}
        style={[
          radioStyles({disabled, layout, color}).outerContainer,
          orientation,
        ]}
        testID={testID}>
        <View
          style={[
            radioStyles({
              inactiveBorderColor,
              activeBorderColor,
              inactiveBackgroundColor,
              activeBackgroundColor,
              isBackgroundTransparent,
              size,
              selected,
              color,
              error,
            }).container,
          ]}>
          {selected && (
            <View
              style={[
                radioStyles({
                  inactiveBackgroundColor,
                  activeBackgroundColor,
                  size,
                  selected,
                  color,
                }).innerContainer,
              ]}
            />
          )}
        </View>
        {Boolean(label) && (
          <Typography
            type={getTypographySize()}
            children={label}
            textStyles={margin}
            textColor={error ? 'accent_negative' : 'text_primary'}
            {...labelProps}
          />
        )}
      </Pressable>
      {Boolean(description) && (
        <Typography type="body" children={description} textStyles={margin} />
      )}
    </>
  );
}
