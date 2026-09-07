import {StyleSheet} from 'react-native';
import {ModalProps} from './Modal';
import {IGetColor} from 'theme';

export const modalStyles = ({
  color,
  type = 'modal',
}: Partial<ModalProps> & {color?: IGetColor}) =>
  StyleSheet.create({
    animatedBackground: {
      flex: 1,
      backgroundColor: color?.('grey_900', 0.5),
    },
    gestureContainer: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      justifyContent: type === 'center' ? 'center' : 'flex-end',
      alignItems: 'center',
      paddingHorizontal: type === 'center' ? 24 : type === 'modal' ? 8 : 0,
      paddingBottom: type === 'modal' ? 32 : 0,
    },
    overlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
    container: {
      position: 'relative',
      width: '100%',
      maxHeight: '93%',
      padding: type === 'center' ? 28 : 24,
      borderRadius: type === 'center' ? 30 : undefined,
      borderBottomLeftRadius: type === 'bottom-sheet' ? 0 : type === 'center' ? 30 : 24,
      borderBottomRightRadius: type === 'bottom-sheet' ? 0 : type === 'center' ? 30 : 24,
    },
    closeButton: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: 52,
      height: 52,
      top: 0,
      right: 0,
      zIndex: 200,
    },
    // Полоса, за которую модал со списком тянут вниз. Ровно под шапкой: ниже
    // начинается список, и там касание должно доставаться ему.
    dragStrip: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 44,
      zIndex: 150,
    },
    grabber: {
      position: 'absolute',
      alignSelf: 'center',
      width: 48,
      height: 4,
      top: 4,
      borderRadius: 2,
      backgroundColor: color?.('icon_tertiary'),
    },
  });
