import {FC, ReactNode, useContext} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IColor, ThemeContext} from 'theme';
import {bgWrapperStyles} from './background-wrapper-styles';

export interface BackgroundWrapperProps {
  children: ReactNode;
  containerStyles?: StyleProp<ViewStyle>;
  // safeAreaStyles works when includesSafeArea is true
  safeAreaStyles?: StyleProp<ViewStyle>;
  includesSafeArea?: boolean;
  backgroundColor?: IColor;
  paddingHorizontal?: number;
}

const BackgroundWrapper: FC<BackgroundWrapperProps> = ({
  children,
  containerStyles,
  includesSafeArea,
  safeAreaStyles,
  ...props
}) => {
  const {color} = useContext(ThemeContext);

  return (
    <View
      style={[
        bgWrapperStyles({color, ...props}).contentContainer,
        containerStyles,
      ]}>
      {includesSafeArea ? (
        <SafeAreaView style={[bgWrapperStyles({}).safeArea, safeAreaStyles]}>
          {children}
        </SafeAreaView>
      ) : (
        children
      )}
    </View>
  );
};

export default BackgroundWrapper;
