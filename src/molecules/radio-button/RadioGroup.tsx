import React from 'react';
import {View} from 'react-native';
import Radio from './Radio';
import {RadioGroupProps} from './RadioTypes';
import {radioGroupStyles} from './radio-group-styles';

export default function RadioGroup({
  accessibilityLabel,
  layout = 'row',
  onPress,
  radioButtons,
  selectedId,
  testID,
  containerStyle,
  children,
  childrenMode = 'prop',
}: RadioGroupProps) {
  function handlePress(id: string) {
    if (id !== selectedId && onPress) {
      onPress(id);
    }
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radiogroup"
      style={[radioGroupStyles({layout}).container, containerStyle]}
      testID={testID}>
      {childrenMode === 'prop'
        ? radioButtons?.map(button => (
            <Radio
              {...button}
              key={button.id}
              selected={button.id === selectedId}
              onPress={() => handlePress(button.id)}
            />
          ))
        : React.Children.map(children, child =>
            React.cloneElement(child, {
              ...child.props,
              selected: child.props.id === selectedId,
              key: child.props.id,
              onPress: () => handlePress(child.props.id),
            }),
          )}
    </View>
  );
}
