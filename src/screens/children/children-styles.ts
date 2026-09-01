import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const childrenStyles = (color?: IGetColor) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    scrollContainer: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 140,
      gap: 14,
    },
    card: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 28,
      padding: 18,
      gap: 14,
    },
    cardHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    cardTexts: {
      flex: 1,
      gap: 3,
    },
    cardActions: {
      flexDirection: 'row',
      // Три действия в строку не помещаются, и подписи обрезались до
      // «Ակտիվը...». По-армянски слова длиннее, поэтому переносим, а не
      // ужимаем: обрезанная подпись не говорит, что делает кнопка.
      flexWrap: 'wrap',
      gap: 10,
    },
    cardAction: {
      flexGrow: 1,
      flexBasis: '45%',
    },
    // Статус видео и звёзды — строка под кнопками. Родителю важно увидеть
    // положение дел, не открывая экран; это сообщение, а не контрол.
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: color?.('controls_border_default', 0.4),
    },
    statusText: {
      flex: 1,
    },
    statusStars: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    footer: {
      paddingTop: 6,
      gap: 10,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 10,
    },
    emptyCircle: {
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: color?.('surface_secondary'),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    formContainer: {
      paddingHorizontal: 22,
      paddingTop: 8,
      paddingBottom: 140,
    },
    dangerCard: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 24,
      marginTop: 22,
      overflow: 'hidden',
    },
  });
