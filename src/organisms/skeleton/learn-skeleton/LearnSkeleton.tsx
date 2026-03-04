import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { BaseSkeleton } from 'organisms';
import { Spacing } from 'molecules';
import { skeletonStyles } from 'organisms/skeleton/skeleton-styles.ts';

const { width } = Dimensions.get('window');


const LearnSkeleton = () => {
  const LearnSkeletonLoop = new Array(6);



  return (
    <View style={skeletonStyles().learnSkeletonContainer}>
      {LearnSkeletonLoop.fill('').map((item, index) => (
        <View style={skeletonStyles().learnItemSkeletonContainer} key={index}>
          <BaseSkeleton
            background={'bg_primary'}
            width={(width - 72) / 2}
            height={150}
          />

          <Spacing size={8} />

          <BaseSkeleton
            background={'bg_primary'}
            width={(width - 40) / 4}
            height={10}
          />
        </View>
      ))}
    </View>
  );
};

export default LearnSkeleton;
