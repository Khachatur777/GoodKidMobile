import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

// The optional-update sheet from the handoff: a tile with the icon, the release
// note lines in their own panel, then the two buttons.
export const updateModalStyles = ({ color }: { color?: IGetColor }) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      gap: 10,
      paddingBottom: 18,
    },
    iconTile: {
      width: 64,
      height: 64,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_active', 0.12),
    },
    notes: {
      backgroundColor: color?.('bg_secondary'),
      borderRadius: 22,
      padding: 16,
      gap: 10,
    },
    note: {
      flexDirection: 'row',
      gap: 11,
      alignItems: 'flex-start',
    },
    bullet: {
      width: 7,
      height: 7,
      borderRadius: 999,
      marginTop: 7,
      backgroundColor: color?.('accent_active'),
    },
    noteText: {
      flex: 1,
    },
    buttons: {
      gap: 10,
      paddingTop: 18,
    },
  });
