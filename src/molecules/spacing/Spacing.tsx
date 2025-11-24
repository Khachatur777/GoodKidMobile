import {FC} from 'react';
import {View} from 'react-native';

export interface SpacingProps {
  size:
    | 2
    | 4
    | 6
    | 8
    | 10
    | 12
    | 16
    | 20
    | 24
    | 32
    | 38
    | 40
    | 48
    | 56
    | 64
    | 80
    | 88;
}

const Spacing: FC<SpacingProps> = ({size}) => {
  return <View style={{marginVertical: size / 2}} />;
};

export default Spacing;
