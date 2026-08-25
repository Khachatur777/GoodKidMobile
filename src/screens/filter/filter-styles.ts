import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const filterStyles = (color?: IGetColor) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 22,
      paddingTop: 8,
      // Clears the count line, the sticky buttons and the floating tab bar:
      // without this the last chips slide under them and look cut off
      paddingBottom: 236,
    },
    section: {
      paddingTop: 24,
    },
    filterItemsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 16,
    },
    // The sticky bottom: the match count over the pair of buttons, on the screen's
    // own background so the chips scrolling underneath do not show through it.
    stickyBottom: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 92,
      paddingHorizontal: 22,
      paddingTop: 12,
      paddingBottom: 8,
      gap: 10,
      backgroundColor: color?.('bg_primary'),
      // A hairline so the chips passing underneath read as scrolled away
      borderTopWidth: 1,
      borderTopColor: color?.('controls_border_default', 0.5),
    },
    countRow: {
      alignItems: 'center',
    },
    // Reset narrower, Save wider
    footer: {
      flexDirection: 'row',
      gap: 12,
    },
    footerReset: {
      flex: 1,
    },
    footerSave: {
      flex: 1.4,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 12,
    },
    emptyCircle: {
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: color?.('surface_secondary'),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    emptyButton: {
      alignSelf: 'stretch',
      paddingTop: 12,
    },
  });
