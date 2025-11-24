import {IIcons, Icons} from 'assets';
import {FC, useContext} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SvgWithCssUri} from 'react-native-svg/css';
import {IColor, ThemeContext} from 'theme';

export interface IconProps {
  name: IIcons;
  color?: IColor;
  opacity?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  uri?: string;
}

const Icon: FC<IconProps> = ({
  name,
  color = 'icon_primary',
  opacity = 1,
  width = 24,
  height = 24,
  style = {},
  uri = undefined,
}) => {
  const {color: ThemeColor} = useContext(ThemeContext);

  const IconComponent = Icons[name] ? Icons[name] : Icons['AlertCircleIcon'];

  return uri ? (
    <SvgWithCssUri width={width} height={width} uri={uri} />
  ) : (
    <IconComponent
      color={ThemeColor(color, opacity)}
      width={width}
      height={height}
      style={style}
    />
  );
};

export default Icon;
