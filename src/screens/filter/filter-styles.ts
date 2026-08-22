import { StyleSheet } from 'react-native';
import { IGetColor } from 'theme';

export const filterStyles = (color?: IGetColor) =>
  StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      paddingHorizontal: 22,
      paddingTop: 8,
      // над липким низом и плавающим таб-баром
      paddingBottom: 190,
    },
    section: {
      paddingTop: 24,
    },
    filterItemsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      paddingTop: 16,
    },
    // Липкая пара кнопок над таб-баром: Reset уже, Save шире
    footer: {
      position: 'absolute',
      left: 22,
      right: 22,
      bottom: 100,
      flexDirection: 'row',
      gap: 12,
    },
    footerReset: {
      flex: 1,
    },
    footerSave: {
      flex: 1.4,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      gap: 12,
    },
    emptyCircle: {
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: color?.('surface_secondary'),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    emptyButton: {
      alignSelf: 'stretch',
      paddingTop: 12,
    },
  });
