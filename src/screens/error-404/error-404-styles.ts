import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const error404Styles = ({
  color,
  variant,
}: {
  color?: IGetColor;
  variant?: 'primary' | 'secondary';
}) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: color?.(
        variant === 'primary' ? 'bg_primary' : 'brand_dark_blue',
      ),
    },
    primary: {
      width: 212,
      height: 212,
      borderRadius: 20,
      backgroundColor: color?.('surface_secondary'),
    },
    secondary: {
      fontSize: 70,
      lineHeight: 70,
    },
  });
};
