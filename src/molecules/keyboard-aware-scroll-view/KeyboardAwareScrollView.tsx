import {ReactNode, useEffect, useRef} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import KeyboardAwareScrollViewComponent from './KeyboardAwareScrollViewComponent';

const KeyboardAwareScrollView = ({
  children,
  ...props
}: {
  children: ReactNode;
  enableOnAndroid?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  enableAutomaticScroll?: boolean;
  extraHeight?: number;
  extraScrollHeight?: number;
  enableResetScrollToCoords?: boolean;
  keyboardOpeningTime?: number;
  viewIsInsideTabBar?: boolean;
  refPropName?: string;
  extractNativeRef?: Function;
  scrollEnabled?: boolean;
  keyboardAvoidingView?: boolean;
  keyboardVerticalOffset?: number;
  containerStyles?: StyleProp<ViewStyle>;
} & ScrollViewProps) => {
  const {
    keyboardAvoidingView = false,
    keyboardVerticalOffset = 0,
    contentContainerStyle = {},
    containerStyles = {},
  } = props;

  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (scrollViewRef.current) {
          if (scrollViewRef.current.scrollTo) {
            // If standard scrollTo is available
            scrollViewRef.current.scrollTo({y: 0, animated: true});
          } else if (scrollViewRef.current.scrollToPosition) {
            // If it's a react-native-keyboard-aware-scroll-view
            scrollViewRef.current.scrollToPosition(0, 0, true);
          }
        }
      },
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={[{flexGrow: 1}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled={keyboardAvoidingView}
      keyboardVerticalOffset={keyboardVerticalOffset}>
      {/* @ts-ignore */}
      <KeyboardAwareScrollViewComponent
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={false}
        {...props}
        contentContainerStyle={[{flexGrow: 1}, containerStyles]}>
        <View style={contentContainerStyle}>{children}</View>
      </KeyboardAwareScrollViewComponent>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAwareScrollView;
