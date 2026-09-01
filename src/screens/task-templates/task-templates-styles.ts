import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const taskTemplatesStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 22,
    },
    hint: {
      paddingTop: 10,
      paddingBottom: 14,
    },
    listContent: {
      paddingBottom: 190,
      gap: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderRadius: 20,
      backgroundColor: color?.('surface_primary'),
    },
    iconTile: {
      width: 42,
      height: 42,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    emoji: {
      fontSize: 20,
    },
    rowText: {
      flex: 1,
      gap: 3,
    },
    reward: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 7,
      paddingHorizontal: 11,
      borderRadius: 999,
      backgroundColor: color?.('surface_secondary'),
    },
    // Красное появляется только под пальцем, когда родитель тянет строку влево.
    // На самой карточке ничего разрушительного не нарисовано.
    deleteAction: {
      width: 96,
      marginLeft: 10,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      backgroundColor: color?.('accent_negative'),
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingHorizontal: 24,
      paddingBottom: 100,
    },
    emptyCircle: {
      width: 96,
      height: 96,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
      marginBottom: 4,
    },
    // Липкая подложка, а не просто кнопка: без фона содержимое прокручивается
    // сквозь неё. Волосяная линия сверху — как на экране фильтра, чтобы было
    // видно, что список уходит под панель. 92 = таб-бар (24 снизу + 68 высоты).
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 92,
      paddingHorizontal: 22,
      paddingTop: 12,
      paddingBottom: 14,
      backgroundColor: color?.('bg_primary'),
      borderTopWidth: 1,
      borderTopColor: color?.('controls_border_default', 0.5),
    },
  });
