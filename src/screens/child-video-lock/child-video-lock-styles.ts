import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const childVideoLockStyles = (color?: IGetColor) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 22,
    },
    selectorRow: {
      paddingTop: 8,
      paddingBottom: 6,
    },
    scroll: {
      paddingTop: 8,
      paddingBottom: 200,
      gap: 16,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
      borderRadius: 18,
      backgroundColor: color?.('surface_primary'),
    },
    switchText: {
      flex: 1,
      gap: 2,
    },
    section: {
      gap: 10,
    },
    label: {
      paddingLeft: 2,
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    stepperButton: {
      width: 56,
      height: 56,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color?.('surface_primary'),
    },
    stepperValue: {
      flex: 1,
      height: 56,
      borderRadius: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: color?.('surface_primary'),
    },
    // Статус — сообщение, а не кнопка. Родитель не может закрыть видео досрочно:
    // сутки уже оплачены звёздами.
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 16,
      borderRadius: 18,
      backgroundColor: color?.('surface_primary'),
    },
    statusText: {
      flex: 1,
      gap: 2,
    },
    note: {
      flexDirection: 'row',
      gap: 10,
      padding: 14,
      borderRadius: 16,
      backgroundColor: color?.('surface_secondary'),
    },
    noteText: {
      flex: 1,
    },
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
