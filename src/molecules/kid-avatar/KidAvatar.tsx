import { FC, useContext } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ThemeContext } from 'theme';
import { getKidAvatarPreset } from './kid-avatar-presets';

interface KidAvatarProps {
  avatarId?: string | null;
  size?: number;
  // The ring around the selected avatar is drawn in the accent over the screen background
  selected?: boolean;
  containerStyle?: ViewStyle;
}

const KidAvatar: FC<KidAvatarProps> = ({
  avatarId,
  size = 60,
  selected = false,
  containerStyle,
}) => {
  const { color, theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const preset = getKidAvatarPreset(avatarId);

  const styles = StyleSheet.create({
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: isDark ? preset.tintDark : preset.tintLight,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: selected ? 2 : 0,
      borderColor: color('accent_active'),
    },
    glyph: {
      fontSize: Math.round(size * 0.5),
      color: isDark ? preset.glyphDark : preset.glyphLight,
    },
  });

  return (
    <View style={[styles.circle, containerStyle]}>
      <Text style={styles.glyph}>{preset.glyph}</Text>
    </View>
  );
};

export default KidAvatar;
