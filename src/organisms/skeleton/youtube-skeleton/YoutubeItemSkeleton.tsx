import {Spacing} from 'molecules';
import {FC, useContext} from 'react';
import {Dimensions, View} from 'react-native';
import {ThemeContext} from 'theme';
import {BaseSkeleton} from '../base-skeleton';
import {skeletonStyles} from '../skeleton-styles';

interface CardSkeletonProps {
  count?: number;
}

const width = Dimensions.get('window').width;

const YoutubeItemSkeleton: FC<CardSkeletonProps> = ({count = 1}) => {
  const {color} = useContext(ThemeContext);
  const YoutubeSkeletonLoop = new Array(count).fill(null);

  return (
    <>
      {YoutubeSkeletonLoop?.map?.((_, index) => {
        return(
          <View
            key={index}
            style={[
              skeletonStyles().cardSkeletonContainer,
              {borderColor: color('controls_border_default')},
              {width: width},
              {height: 250},
              {backgroundColor: color('bg_primary')},
            ]}>
            <BaseSkeleton width={width} height={190} />

            <View style={skeletonStyles().cardFooterSkeletonContainer}>
              <BaseSkeleton width={38} height={38} radius={50}/>

              <View>
                <BaseSkeleton width={66} height={8} />

                <Spacing size={12} />

                <BaseSkeleton width={93} height={8} />
              </View>

            </View>
          </View>
        )
      })}
    </>
  );
};

export default YoutubeItemSkeleton;
