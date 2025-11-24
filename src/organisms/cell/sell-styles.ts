import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';
import {CellProps} from './Cell';

export const cellStyles = ({
  color,
  pressed,
  type,
  pressWithBackground,
  disabled,
  blocked,
}: Partial<CellProps> & {
  color?: IGetColor;
  pressed?: boolean;
  disabled?: boolean;
}) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 64,
      paddingHorizontal: 16,
      paddingVertical: 8,
      opacity: disabled ? 0.3 : 1,
      backgroundColor: blocked
        ? color?.('controls_cell_selected')
        : pressWithBackground
        ? color?.('controls_cell_selected', pressed ? 1 : 0)
        : 'transparent',
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flexShrink: 1,
    },
    right: {
      flexDirection: 'row',
      alignItems: type === 'image' ? 'flex-start' : 'center',
      height: '100%',
    },
    content: {
      flexShrink: 1,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    titleTextStyle: {
      textAlign: 'left',
    },
    titleIcon: {
      marginLeft: 8,
    },
    description: {
      flexShrink: 1,
      width: '100%',
    },
    status: {
      flexShrink: 1,
      width: '100%',
    },
    rightArrowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
