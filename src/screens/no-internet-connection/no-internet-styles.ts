import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

// Same shape as the force-update screen in the handoff: an illustration panel
// on top, the line of text under it, the action pinned to the bottom.
export const noInternetStyles = ({ color }: { color?: IGetColor }) =>
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
      flex: 1,
      maxHeight: 360,
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
    footer: {
      paddingBottom: 34,
    },
  });
