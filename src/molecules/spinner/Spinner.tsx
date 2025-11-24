import {spinnerAnimation} from 'assets';
import LottieView, {LottieViewProps} from 'lottie-react-native';
import {FC, useCallback} from 'react';
import {View} from 'react-native';

export interface SpinnerProps extends Partial<LottieViewProps> {
  size?: 'small' | 'medium' | 'large';
}

const Spinner: FC<SpinnerProps> = ({size = 'medium', ...props}) => {
  const getSize = useCallback(() => {
    switch (size) {
      case 'large':
        return {
          width: 56,
          height: 56,
        };
      case 'medium':
        return {
          width: 40,
          height: 40,
        };
      case 'small':
        return {
          width: 24,
          height: 24,
        };
      default:
        break;
    }
  }, [size]);

  return (
    <View>
      <LottieView
        autoPlay
        loop
        {...props}
        source={spinnerAnimation}
        style={{...getSize()}}
      />
    </View>
  );
};

export default Spinner;
