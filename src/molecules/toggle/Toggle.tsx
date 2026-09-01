import { FC, useContext } from 'react';
import { Platform, Switch } from 'react-native';
import { ThemeContext } from 'theme';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

// The app had no switch until now — settings were all navigation and chips. This
// wraps the platform one rather than drawing a new control: a switch is the one
// thing users already know by muscle memory, and the accent follows the theme so
// it changes with the child's chosen colour.
const Toggle: FC<ToggleProps> = ({ value, onValueChange, disabled }) => {
  const { color } = useContext(ThemeContext);

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: color('controls_inactive'),
        true: color('accent_active'),
      }}
      // iOS paints the knob white itself; Android needs telling.
      thumbColor={Platform.OS === 'android' ? color('surface_primary') : undefined}
      ios_backgroundColor={color('controls_inactive')}
    />
  );
};

export default Toggle;
