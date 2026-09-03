import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const childrenStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 18,
    },
    listContent: {
      paddingBottom: 120,
      gap: 12,
    },
    // Карточка целиком кликабельна и ведёт на страницу ребёнка. Раньше здесь
    // лежали шесть одинаковых кнопок — глазу не за что зацепиться, а состояния
    // ребёнка не видно вовсе.
    card: {
      borderRadius: 24,
      padding: 16,
      paddingHorizontal: 18,
      gap: 14,
      backgroundColor: color?.('surface_primary'),
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    cardText: {
      flex: 1,
      gap: 3,
    },
    starPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 7,
      paddingHorizontal: 11,
      borderRadius: 999,
      backgroundColor: color?.('accent_star', 0.16),
    },
    // Две плашки состояния: что ждёт родителя и что с видео. Цветом отличается
    // только то, что требует внимания, — иначе карточка пестрит и снова ничего
    // не выделяется.
    chipsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    chip: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      backgroundColor: color?.('surface_secondary'),
    },
    chipAlert: {
      backgroundColor: color?.('accent_negative', 0.12),
    },
    chipOk: {
      backgroundColor: color?.('accent_positive', 0.12),
    },
    chipText: {
      flex: 1,
    },
    // Предел детей — не ошибка, поэтому пунктир и серый, а не предупреждение.
    limitBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 4,
      paddingVertical: 18,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: color?.('controls_border_default'),
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
    // Ниже — общее с экранами добавления и правки ребёнка: файл стилей у папки
    // один, и переписывая список я эти ключи снёс.
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 10,
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
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 92,
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 14,
      backgroundColor: color?.('bg_primary'),
      borderTopWidth: 1,
      borderTopColor: color?.('controls_border_default', 0.5),
    },
  });
