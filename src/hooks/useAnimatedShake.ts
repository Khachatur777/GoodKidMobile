import {useCallback} from 'react';
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface UseAnimatedShakeProps {
  duration?: number;
  translationAmount?: number;
  repeatCount?: number;
}

const useAnimatedShake = ({
  duration = 80,
  translationAmount = 10,
  repeatCount = 3,
}: UseAnimatedShakeProps) => {
  const shakeTranslateX = useSharedValue(0);

  const shake = useCallback(() => {
    const TranslationAmount = translationAmount;
    const timingConfig = {
      // cubic-bezier(.35,.7,.5,.7)
      easing: Easing.bezier(0.35, 0.7, 0.5, 0.7),
      duration: duration,
    };
    shakeTranslateX.value = withSequence(
      withTiming(TranslationAmount, timingConfig),
      withRepeat(
        withTiming(-TranslationAmount, timingConfig),
        repeatCount,
        true,
      ),
      withSpring(0, {
        mass: 0.5,
      }),
    );
  }, [duration, translationAmount, repeatCount]);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: shakeTranslateX.value}],
    };
  }, []);

  const isShaking = useDerivedValue(() => {
    return shakeTranslateX.value !== 0;
  }, []);

  return {shake, rStyle, isShaking};
};

export default useAnimatedShake;
