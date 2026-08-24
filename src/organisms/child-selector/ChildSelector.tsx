import { FC, useContext, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { KidAvatar, Typography } from 'molecules';
import { IChild } from 'models';
import { ThemeContext } from 'theme';

interface ChildSelectorProps {
  children: IChild[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// A horizontal row of children above the filter. There is no 'parent' option:
// a parent filters their own feed with the chips on Home; this screen sets up children.
const ChildSelector: FC<ChildSelectorProps> = ({ children, selectedId, onSelect }) => {
  const { color } = useContext(ThemeContext);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: 18,
          paddingVertical: 4,
          paddingHorizontal: 2,
        },
        item: {
          alignItems: 'center',
          gap: 8,
          width: 76,
        },
        ring: {
          padding: 3,
          borderRadius: 999,
          borderWidth: 2,
          borderColor: 'transparent',
        },
        ringSelected: {
          borderColor: color('accent_active'),
        },
      }),
    [color],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {children.map(child => {
        const selected = child.id === selectedId;

        return (
          <Pressable key={child.id} style={styles.item} onPress={() => onSelect(child.id)}>
            <View style={[styles.ring, selected ? styles.ringSelected : null]}>
              <KidAvatar avatarId={child.avatar} size={62} />
            </View>

            <Typography
              type={selected ? 'captionBold' : 'caption'}
              textColor={selected ? 'text_primary' : 'text_secondary'}
              numberOfLines={1}
            >
              {child.name}
            </Typography>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default ChildSelector;
