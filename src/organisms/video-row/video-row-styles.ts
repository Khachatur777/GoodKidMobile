import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const videoRowStyles = ({
  color,
  size,
}: {
  color?: IGetColor;
  size?: 'small' | 'medium';
}) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: color?.('surface_primary'),
      borderRadius: 22,
      padding: 10,
      marginBottom: 8,
      shadowColor: '#191634',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: {width: 0, height: 2},
      elevation: 2,
    },
    thumbnail: {
      width: size === 'medium' ? 96 : 82,
      height: size === 'medium' ? 64 : 58,
      borderRadius: 15,
      backgroundColor: color?.('surface_secondary'),
    },
    textContainer: {
      flex: 1,
      gap: 4,
    },
  });
