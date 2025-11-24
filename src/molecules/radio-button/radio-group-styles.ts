import {StyleSheet} from 'react-native';
import {RadioGroupProps} from './RadioTypes';

export const radioGroupStyles = ({layout}: Partial<RadioGroupProps>) => {
  return StyleSheet.create({
    container: {
      alignItems: layout === 'column' ? 'flex-start' : 'center',
      flexDirection: layout,
    },
  });
};
