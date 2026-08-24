import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

// Two shapes from the handoff: the parent gets an illustration panel with the
// version chips under it, the child a single round badge and no numbers —
// versions mean nothing to them, a grown-up has to do it anyway.
export const forceUpdateStyles = ({ color }: { color?: IGetColor }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
    },
    content: {
      flex: 1,
      paddingTop: 30,
    },
    illustration: {
      // The handoff draws 380; on short screens it gives way to the text
      flex: 1,
      maxHeight: 380,
      borderRadius: 32,
      backgroundColor: color?.('accent_active', 0.12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    illustrationCircle: {
      position: 'absolute',
      width: 230,
      height: 230,
      borderRadius: 999,
      backgroundColor: color?.('accent_active', 0.18),
    },
    texts: {
      paddingTop: 32,
      paddingHorizontal: 4,
      gap: 12,
    },
    versions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 4,
    },
    chip: {
      paddingVertical: 6,
      paddingHorizontal: 13,
      borderRadius: 999,
      backgroundColor: color?.('bg_secondary'),
    },
    chipNext: {
      backgroundColor: color?.('accent_active', 0.12),
    },
    footer: {
      paddingBottom: 34,
      gap: 12,
    },
    hint: {
      paddingVertical: 4,
    },

    kidContent: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 26,
      paddingTop: 40,
    },
    kidBadge: {
      width: 260,
      height: 260,
      borderRadius: 999,
      backgroundColor: color?.('yellow_100') ?? '#FFF1CE',
      alignItems: 'center',
      justifyContent: 'center',
    },
    kidTexts: {
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
    },
    kidFooter: {
      paddingBottom: 40,
    },
  });
