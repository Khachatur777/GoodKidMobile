import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const childTasksStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 18,
    },
    // Дети выбираются плитками во всю ширину, а не кружками: в плитку помещается
    // счётчик задач, ждущих подтверждения, а это главное, ради чего родитель
    // сюда заходит.
    childRow: {
      flexDirection: 'row',
      gap: 10,
      paddingBottom: 12,
    },
    childPill: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 10,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: color?.('surface_primary'),
    },
    childPillSelected: {
      borderColor: color?.('accent_active'),
    },
    childName: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 190,
      gap: 12,
    },
    groupHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 4,
      paddingTop: 4,
    },
    // Красный, а не акцентный: акцент ребёнок меняет сам, и на красной теме
    // счётчик сливался бы с фоном кнопок.
    counter: {
      minWidth: 20,
      height: 20,
      paddingHorizontal: 6,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('accent_negative'),
    },
    // Карточка ожидающей задачи — отдельная: с неё родитель действует.
    pendingCard: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 20,
      padding: 16,
      gap: 12,
    },
    pendingTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    pendingText: {
      flex: 1,
      gap: 3,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 9,
    },
    action: {
      flex: 1,
    },
    // Выданные и выполненные — списком внутри одной карточки, разделённые
    // волосяной линией. Отдельными карточками список рассыпался на плитки.
    groupCard: {
      backgroundColor: color?.('surface_primary'),
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
    },
    rowDivided: {
      borderBottomWidth: 1,
      borderBottomColor: color?.('surface_stroke'),
    },
    iconTile: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_secondary'),
    },
    iconTileDone: {
      backgroundColor: color?.('accent_positive', 0.14),
    },
    emoji: {
      fontSize: 19,
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    reward: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
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
    // Одна кнопка: шаблоны переехали в закладку в шапке, как в макете.
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
