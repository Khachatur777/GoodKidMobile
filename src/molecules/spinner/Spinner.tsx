import {spinnerAnimation} from 'assets';
import LottieView, {LottieViewProps} from 'lottie-react-native';
import {FC, useCallback, useContext, useMemo} from 'react';
import {View} from 'react-native';
import {ThemeContext} from 'theme';

export interface SpinnerProps extends Partial<LottieViewProps> {
  size?: 'small' | 'medium' | 'large';
}

// The spinner animation sets its colour through a gradient stroke (ty: 'gs'),
// which Lottie's colorFilters do not repaint — so we swap the gradient stops in
// a copy of the JSON for the chosen accent.
const rgbFromThemeColor = (value: string): [number, number, number] | null => {
  const match = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(value);
  if (!match) {
    return null;
  }
  return [+match[1] / 255, +match[2] / 255, +match[3] / 255];
};

const recolorGradients = (items: any[], rgb: [number, number, number]) => {
  for (const item of items) {
    if ((item?.ty === 'gs' || item?.ty === 'gf') && Array.isArray(item?.g?.k?.k)) {
      const stops = item.g.k.k;
      const stopCount = item.g.p ?? stops.length / 4;

      // Each stop is [position, r, g, b]; alpha stops follow and are left alone
      for (let i = 0; i < stopCount; i++) {
        const offset = i * 4;
        if (offset + 3 < stops.length) {
          stops[offset + 1] = rgb[0];
          stops[offset + 2] = rgb[1];
          stops[offset + 3] = rgb[2];
        }
      }
    }

    if (Array.isArray(item?.it)) {
      recolorGradients(item.it, rgb);
    }
  }
};

const Spinner: FC<SpinnerProps> = ({size = 'medium', ...props}) => {
  const {color} = useContext(ThemeContext);

  const accentRgb = rgbFromThemeColor(color('accent_active'));

  const source = useMemo(() => {
    if (!accentRgb) {
      return spinnerAnimation;
    }

    const copy = JSON.parse(JSON.stringify(spinnerAnimation));
    for (const layer of copy?.layers || []) {
      if (Array.isArray(layer?.shapes)) {
        recolorGradients(layer.shapes, accentRgb);
      }
    }
    return copy;
  }, [accentRgb?.[0], accentRgb?.[1], accentRgb?.[2]]);

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
        source={source}
        style={{...getSize()}}
      />
    </View>
  );
};

export default Spinner;
