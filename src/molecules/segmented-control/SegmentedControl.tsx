import { FC, useContext, useMemo } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { ThemeContext } from 'theme';
import Typography from '../typography/Typography';

export interface ISegmentedItem<T extends string = string> {
  value: T;
  title: string;
}

interface SegmentedControlProps<T extends string = string> {
  items: ISegmentedItem<T>[];
  value: T;
  onChange: (value: T) => void;
  containerStyle?: ViewStyle;
}

// The toggle from the design: a track in a soft accent, the selected pill in the
// accent itself. Used for the role at sign-in, the child's language and activity tabs.
const SegmentedControl: FC<SegmentedControlProps> = ({
  items,
  value,
  onChange,
  containerStyle,
}) => {
  const { color } = useContext(ThemeContext);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        track: {
          flexDirection: 'row',
          padding: 4,
          borderRadius: 999,
          backgroundColor: color('surface_secondary'),
        },
        item: {
          flex: 1,
          height: 44,
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
        },
        itemSelected: {
          backgroundColor: color('accent_active'),
        },
      }),
    [color],
  );

  return (
    <View style={[styles.track, containerStyle]}>
      {items.map(item => {
        const selected = item.value === value;

        return (
          <Pressable
            key={item.value}
            style={[styles.item, selected ? styles.itemSelected : null]}
            onPress={() => onChange(item.value)}
          >
            <Typography
              type="bodyMBold"
              textColor={selected ? 'text_inverted' : 'text_secondary'}
            >
              {item.title}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
