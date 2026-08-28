import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const cardSessionStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 22,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 8,
    },
    topButton: {
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressBox: {
      flex: 1,
      gap: 7,
      paddingHorizontal: 4,
    },
    progressLabel: {
      textAlign: 'center',
    },
    progressTrack: {
      height: 8,
      borderRadius: 999,
      overflow: 'hidden',
      backgroundColor: color?.('surface_stroke'),
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: color?.('accent_active'),
    },
    stage: {
      flex: 1,
      gap: 16,
    },
    imageBox: {
      flex: 1,
      minHeight: 200,
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: color?.('surface_primary'),
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    // Предметы для счёта: крупные, с промежутками, никогда не внахлёст —
    // иначе их невозможно сосчитать.
    objects: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      padding: 20,
    },
    object: {
      fontSize: 58,
      lineHeight: 70,
    },
    questionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    questionText: {
      flex: 1,
    },
    // Кнопка озвучки всегда на одном месте, во всех типах карточек: ребёнок
    // запоминает позицию пальца, а не иконку.
    speaker: {
      width: 64,
      height: 64,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    speakerActive: {
      backgroundColor: color?.('accent_active'),
    },
    options: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    option: {
      flexGrow: 1,
      flexBasis: '30%',
      minHeight: 104,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
      backgroundColor: color?.('surface_primary'),
    },
    optionCorrect: {
      borderColor: color?.('text_positive'),
    },
    optionWrong: {
      borderColor: color?.('accent_warning'),
    },
    optionEmoji: {
      fontSize: 46,
      lineHeight: 56,
    },
    description: {
      marginTop: 4,
    },
    next: {
      height: 72,
      marginTop: 'auto',
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_active'),
    },
    nextText: {
      fontSize: 22,
      fontWeight: '900',
    },
  });
