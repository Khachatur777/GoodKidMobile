import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import {
  Platform,
  Pressable,
  Modal as ReactNativeModal,
  ModalProps as ReactNativeModalProps,
  StyleProp,
  View,
  ViewStyle,
  KeyboardAvoidingView,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { CardWrapper, Icon, Loader } from 'molecules';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { getMainLoadingState } from 'rtk';
import { IColor, ThemeContext } from 'theme';
import { eventEmitter } from 'utils';
import { modalStyles } from './modal-styles';

export interface ModalProps extends ReactNativeModalProps {
  children: ReactNode | ReactNode[];
  showLoader?: boolean;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  swipeToClose?: boolean;
  showCloseButton?: boolean;
  closeIconColor?: IColor;
  showGrabber?: boolean;
  backgroundColor?: IColor;
  // 'center' is the confirmation dialog from the handoff: a card in the middle
  // of the screen. 'modal' floats above the bottom edge, 'bottom-sheet' sticks to it.
  type?: 'modal' | 'bottom-sheet' | 'center';
  contentContainerStyles?: StyleProp<ViewStyle>;
  containerStyles?: StyleProp<ViewStyle>;
  activateAfterLongPress?: number;
  keyboardAvoidingView?: boolean;
  disableOnBackgroundPress?: boolean;
  onCloseModal?: () => void;
}

const Modal: FC<ModalProps> = ({
                                 isVisible,
                                 setIsVisible,
                                 children,
                                 showLoader = false,
                                 swipeToClose = true,
                                 showCloseButton = false,
                                 closeIconColor = 'icon_secondary',
                                 showGrabber = true,
                                 disableOnBackgroundPress = false,
                                 backgroundColor = 'surface_overlay',
                                 type = 'modal',

                                 contentContainerStyles = {},
                                 containerStyles = {},
                                 activateAfterLongPress = 0,
                                 keyboardAvoidingView = false,
                                 onCloseModal,
                                 ...props
                               }) => {
  const { color } = useContext(ThemeContext);
  const isLoading = useSelector(getMainLoadingState);

  // In Ios We Cannot Open Multiple Modals


  const translateY = useSharedValue(0);

  const onClose = useCallback(() => {
    translateY.value = 0;
    onCloseModal?.();
    setIsVisible(false);
  }, [translateY.value]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      translateY.value = 0;
    })
    .onUpdate(event => {
      if (event.translationY > 0 && swipeToClose)
        translateY.value = event.translationY;
    })
    .onEnd(event => {
      if (event.translationY > 100) {
        if (onClose && swipeToClose) {
          runOnJS(onClose)();
        }
      } else {
        translateY.value = 0;
      }
    });

  if (Platform.OS === 'android') {
    panGesture.activateAfterLongPress(activateAfterLongPress);
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  useEffect(() => {
    if (Platform.OS === 'android') return;
    const closeListener = () => {
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    };

    eventEmitter.on('closeModal', closeListener);

    return () => {
      if (Platform.OS === 'android') return;
      eventEmitter.off('closeModal', closeListener);
    };
  }, [setIsVisible]);

  const ContentWrapper = keyboardAvoidingView ? KeyboardAvoidingView : View;

  return (
    <ReactNativeModal
      {...props}
      animationType="fade"
      presentationStyle="overFullScreen"
      visible={
        isVisible
      }
      transparent>
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[modalStyles({ color, ...props }).animatedBackground]}>
        <GestureHandlerRootView style={modalStyles(props).gestureContainer}>
          <GestureDetector gesture={panGesture}>
            <ContentWrapper
              {...(keyboardAvoidingView
                ? {
                  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
                }
                : {})}
              style={modalStyles(props).gestureContainer}>
              <Animated.View
                style={[
                  modalStyles({ type, ...props }).contentContainer,
                  animatedStyle,
                  containerStyles,
                ]}>
                <Pressable
                  disabled={disableOnBackgroundPress}
                  onPress={onClose}
                  style={modalStyles({}).overlay}
                />

                <CardWrapper
                  backgroundColor={backgroundColor}
                  containerStyles={[
                    modalStyles({ type, ...props }).container,
                    contentContainerStyles,
                  ]}>
                  {showCloseButton && (
                    <Pressable
                      onPress={onClose}
                      style={modalStyles(props).closeButton}>
                      <Icon
                        width={20}
                        height={20}
                        color={closeIconColor}
                        name="XCloseIcon"
                      />
                    </Pressable>
                  )}

                  {type === 'bottom-sheet' && showGrabber ? (
                    <View style={modalStyles({ color }).grabber} />
                  ) : null}

                  {children}
                </CardWrapper>
              </Animated.View>
            </ContentWrapper>
          </GestureDetector>
        </GestureHandlerRootView>
      </Animated.View>

      <Loader isLoading={showLoader && isLoading} />
    </ReactNativeModal>
  );
};

export default Modal;
