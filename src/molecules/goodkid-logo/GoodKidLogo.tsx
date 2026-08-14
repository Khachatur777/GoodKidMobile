import {FC, useContext} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import Svg, {Circle, Path, Rect} from 'react-native-svg';
import Typography from '../typography/Typography.tsx';
import {ThemeContext} from 'theme';
import {goodKidLogoStyles} from './goodkid-logo-styles.ts';

export interface GoodKidLogoProps {
  size?: number;
  // mark — только божья коровка; stacked — коровка + GOODKID + слоган
  variant?: 'mark' | 'stacked';
  containerStyles?: StyleProp<ViewStyle>;
}

// Логотип из дизайна v2 (Good Kid App v2.dc.html)
const GoodKidLogo: FC<GoodKidLogoProps> = ({
  size = 34,
  variant = 'mark',
  containerStyles,
}) => {
  const {theme} = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const body = isDark ? '#F2542D' : '#D9451F';
  const details = isDark ? '#131126' : '#191634';
  const antennae = isDark ? '#F2542D' : '#191634';

  const mark = (
    <Svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <Circle cx="17" cy="20" r="12" fill={body} />
      <Path d="M17 8a12 12 0 0 1 12 12H5A12 12 0 0 1 17 8Z" fill={body} />
      <Path
        d="M17 8c-2.2 0-4.2.6-5.9 1.7A6.6 6.6 0 0 0 17 12.5c2.4 0 4.6-1.1 5.9-2.8A10.8 10.8 0 0 0 17 8Z"
        fill={details}
      />
      <Rect x="16.1" y="9" width="1.8" height="23" rx="0.9" fill={details} />
      <Circle cx="10.4" cy="17.6" r="2.1" fill={details} />
      <Circle cx="23.6" cy="17.6" r="2.1" fill={details} />
      <Circle cx="12.2" cy="25" r="1.8" fill={details} />
      <Circle cx="21.8" cy="25" r="1.8" fill={details} />
      <Path
        d="M12.5 6.4 14.6 8.8M21.5 6.4 19.4 8.8"
        stroke={antennae}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );

  if (variant === 'mark') {
    return <View style={containerStyles}>{mark}</View>;
  }

  const styles = goodKidLogoStyles();

  return (
    <View style={[styles.stackedContainer, containerStyles]}>
      {mark}

      <View style={styles.wordmarkContainer}>
        <View style={styles.wordmarkRow}>
          <Typography type="title2">GOOD</Typography>
          <Typography type="title2" textStyles={{color: body}}>
            KID
          </Typography>
        </View>

        <Typography type="bodySBold" textColor="text_secondary">
          Learn | Play - Grow
        </Typography>
      </View>
    </View>
  );
};

export default GoodKidLogo;
