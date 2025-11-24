import {FC} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {BaseSkeleton} from '../base-skeleton';
import {skeletonStyles} from '../skeleton-styles';

export interface CellSkeletonProps {
  count?: number;
  cellContainerStyle?: StyleProp<ViewStyle>;
}

const CellSkeleton: FC<CellSkeletonProps> = ({
  count = 1,
  cellContainerStyle,
}) => {
  const CellSkeletonLoop = new Array(count).fill(null);

  return (
    <>
      {CellSkeletonLoop.map((_, index) => (
        <View
          key={index.toString()}
          style={[skeletonStyles().cellContainer, cellContainerStyle]}>
          <BaseSkeleton width={48} height={48} />

          <View style={skeletonStyles().cellRows}>
            <BaseSkeleton width={66} height={8} />

            <BaseSkeleton width={93} height={8} />
          </View>
        </View>
      ))}
    </>
  );
};

export default CellSkeleton;
