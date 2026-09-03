import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const mathCategoriesStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingBottom: 10,
    },
    headerTitle: {
      flex: 1,
    },
    starPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: color?.('accent_star', 0.16),
    },
    content: {
      paddingBottom: 130,
      gap: 8,
    },
    groupTitle: {
      paddingTop: 4,
    },
    // Плитками, а не строками: у ребёнка на экране умещается весь раздел сразу,
    // и выбор идёт по знаку, а не по чтению названий.
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tile: {
      // Ширина приходит из экрана: проценты с зазорами не сходятся — на узком
      // экране три плитки по 31.8% плюс два зазора вылезали за контейнер, и ряд
      // ломался на две. Считаем от реальной ширины окна.
      height: 86,
      borderRadius: 20,
      padding: 11,
      justifyContent: 'space-between',
      backgroundColor: color?.('surface_primary'),
      borderWidth: 2,
      borderColor: color?.('accent_active'),
    },
    // Пройденное — без рамки и приглушённое: это уже не выбор, а память о том,
    // что ребёнок умеет.
    tileMuted: {
      height: 76,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    sign: {
      fontSize: 24,
      fontWeight: '900',
      lineHeight: 26,
      color: color?.('accent_active'),
    },
    signMuted: {
      fontSize: 22,
      color: color?.('text_tertiary'),
    },
    signSmall: {
      fontSize: 19,
    },
    tileBottom: {
      gap: 2,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    infinity: {
      fontSize: 13,
      fontWeight: '800',
      color: color?.('accent_active'),
    },
    // Подсказка про бесконечные категории прижата к низу экрана, как в макете.
    note: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 18,
      backgroundColor: color?.('surface_secondary'),
    },
    noteText: {
      flex: 1,
    },
    loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
