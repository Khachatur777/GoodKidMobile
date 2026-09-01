import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const videoLockedStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 28,
      paddingBottom: 90,
      gap: 12,
    },
    lockCircle: {
      width: 116,
      height: 116,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
      marginBottom: 6,
    },
    // Полоска прогресса вместо голого «не хватает 4»: ребёнку нужно видеть, что
    // он уже близко, а не только чего у него нет.
    progressRow: {
      width: '100%',
      gap: 8,
      marginTop: 8,
      marginBottom: 4,
    },
    progressTrack: {
      height: 10,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: color?.('surface_secondary'),
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: color?.('accent_active'),
    },
    progressLabels: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    progressRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    primaryButton: {
      width: '100%',
      marginTop: 12,
    },
    secondaryRow: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      marginTop: 4,
    },
    secondaryItem: {
      flex: 1,
    },
    // Строка «сейчас 14 ★ → останется 4 ★» в модалке: обмен виден целиком,
    // и ребёнок соглашается, понимая, что именно тратит.
    exchangeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 18,
      backgroundColor: color?.('surface_secondary'),
      marginTop: 6,
    },
    exchangeSide: {
      alignItems: 'center',
      gap: 4,
    },
    exchangeStars: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    // Плашка над лентой, когда видео открыто. Тонкая намеренно: она сообщает, а
    // не соревнуется с содержимым за внимание.
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginHorizontal: 22,
      marginBottom: 10,
      paddingVertical: 9,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: color?.('surface_secondary'),
    },
  });
