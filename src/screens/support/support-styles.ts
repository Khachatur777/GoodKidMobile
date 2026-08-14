import {StyleSheet} from 'react-native';
import {IGetColor} from 'theme';

export const supportStyles = (color?: IGetColor) =>
  StyleSheet.create({
    scrollContent: {
      paddingHorizontal: 18,
      paddingTop: 6,
      paddingBottom: 120,
      gap: 14,
    },
    card: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 28,
      padding: 20,
      gap: 14,
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
    },
    introDescription: {
      lineHeight: 22,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    emailButton: {
      flex: 1,
      height: 52,
      borderRadius: 18,
      backgroundColor: color?.('accent_active'),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    chatButton: {
      width: 52,
      height: 52,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: color?.('surface_stroke'),
      backgroundColor: color?.('surface_primary'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    faqLabel: {
      paddingLeft: 6,
      paddingTop: 2,
    },
    faqCard: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 26,
      paddingHorizontal: 18,
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
    },
    faqRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 16,
    },
    faqRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: color?.('surface_stroke', 0.6),
    },
    faqQuestion: {
      flex: 1,
    },
    chevronDown: {
      transform: [{rotate: '90deg'}],
    },
    chevronUp: {
      transform: [{rotate: '-90deg'}],
    },
    faqAnswer: {
      paddingBottom: 16,
      lineHeight: 21,
    },
    contactCard: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 26,
      padding: 16,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      shadowColor: '#191634',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
    },
    contactTextContainer: {
      flex: 1,
      gap: 2,
    },
  });
