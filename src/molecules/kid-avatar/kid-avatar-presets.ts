// Avatar presets for children. Photos are never uploaded — a child only picks
// from this set, and all that leaves the device is a key like 'avatar_3'.
//
// The circle tone and character colour pairs come from the handoff. The real
// illustrations are not drawn yet, so a placeholder glyph stands in, as in the design.
export interface IKidAvatarPreset {
  id: string;
  tintLight: string;
  glyphLight: string;
  tintDark: string;
  glyphDark: string;
  glyph: string;
}

const PALETTE = [
  {tintLight: '#E0D8FB', glyphLight: '#6B4EE6', tintDark: '#2A2350', glyphDark: '#A38BFF'},
  {tintLight: '#FFE3A0', glyphLight: '#8A6200', tintDark: '#3A2F16', glyphDark: '#FFC53D'},
  {tintLight: '#D8F1E8', glyphLight: '#0E7A61', tintDark: '#16332B', glyphDark: '#55D6B0'},
  {tintLight: '#FCE3EC', glyphLight: '#C1356B', tintDark: '#3A1B29', glyphDark: '#FF7FAE'},
  {tintLight: '#DCE9FF', glyphLight: '#2F6BFF', tintDark: '#14294D', glyphDark: '#79A8FF'},
];

const GLYPHS = ['🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐷', '🐸', '🐵', '🦄', '🐙'];

export const KID_AVATAR_PRESETS: IKidAvatarPreset[] = GLYPHS.map((glyph, index) => {
  const palette = PALETTE[index % PALETTE.length];

  return {
    id: `avatar_${index + 1}`,
    glyph,
    ...palette,
  };
});

export const DEFAULT_KID_AVATAR_ID = KID_AVATAR_PRESETS[0].id;

export const getKidAvatarPreset = (id?: string | null): IKidAvatarPreset =>
  KID_AVATAR_PRESETS.find(preset => preset.id === id) || KID_AVATAR_PRESETS[0];
