import {FC, useContext, useEffect, useMemo} from 'react';
import {
  Animated,
  DimensionValue,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {StyleProps} from 'react-native-reanimated';
import {IColor, ThemeContext} from 'theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const windowWidth = Dimensions.get('window').width;

export interface BaseSkeletonProps {
  height?: DimensionValue;
  width?: DimensionValue;
  count?: number;
  background?: IColor;
  duration?: number;
  radius?: number;
  betweenSpace?: number;
  containerStyles?: StyleProps;
  innerContainerStyles?: StyleProps;
}

const BaseSkeleton: FC<BaseSkeletonProps> = ({
  height = 60,
  count = 1,
  background = 'bg_secondary',
  duration = 1000,
  width = '100%',
  radius = 8,
  betweenSpace = 0,
  containerStyles = {},
  innerContainerStyles = {},
}) => {
  const BaseSkeletonLoop = new Array(count);
  const {theme, color} = useContext(ThemeContext);

  const animatedValue = useMemo(() => new Animated.Value(0), []);
  const colorTrans = color('bg_primary', theme === 'dark' ? 1 : 0.4);
  const colorTrans1 = color('bg_secondary', theme === 'dark' ? 0.1 : 0.9);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-windowWidth, windowWidth],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [animatedValue, duration]);

  return (
    <>
      {BaseSkeletonLoop.fill('').map((item, index) => (
        <View key={index.toString()} style={[containerStyles]}>
          <Animated.View
            style={[
              {
                flexShrink: 1,
                marginRight: 10,
                backgroundColor: color(background, 0.7),
                overflow: 'hidden',
                height,
                width,
                borderRadius: radius,
                marginTop: index !== 0 && count > 1 ? betweenSpace : 0,
              },
              innerContainerStyles,
            ]}>
            <AnimatedLinearGradient
              colors={[colorTrans1, colorTrans, colorTrans, colorTrans1]}
              end={{x: 1, y: 0}}
              start={{x: 0, y: 0}}
              style={[StyleSheet.absoluteFill, {transform: [{translateX}]}]}
            />
          </Animated.View>
        </View>
      ))}
    </>
  );
};

export default BaseSkeleton;
