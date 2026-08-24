import {StyleSheet} from 'react-native';
import {IColor} from 'theme';

// Anatomy from the handoff: a tinted tile with the icon, a centred title and
// description, then full-width buttons stacked with the confirming one on top.
export const alertMStyles = ({color, tone}: {color?: IColor; tone?: 'accent' | 'negative'} = {}) =>
  StyleSheet.create({
    iconContainer: {
      alignItems: 'center',
    },
    iconTile: {
      width: 68,
      height: 68,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        tone === 'negative' ? color?.('red_50') : color?.('accent_active', 0.12),
    },
    buttonsContainer: {
      gap: 10,
      paddingTop: 6,
    },
    closeBtn: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: 32,
      height: 32,
      top: 8,
      right: 8,
    },
  });
