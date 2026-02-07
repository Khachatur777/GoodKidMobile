import {FC, useContext, useMemo} from 'react';
import {Image, Pressable, View, useWindowDimensions} from 'react-native';
import {CardWrapper, Typography} from 'molecules';
import { formatTime, isTablet, thumbHeight } from 'utils';
import {ThemeContext} from 'theme';
import {KidsVideoItem} from 'models';
import {homeStyles} from '../home-styles';

export interface IVideoItemProps {
  videoData: KidsVideoItem;
  onPress: () => void;
}

const VideoItem: FC<IVideoItemProps> = ({videoData, onPress}) => {
  const {color} = useContext(ThemeContext);
  const {width, height} = useWindowDimensions();

  const styles = useMemo(
    () => homeStyles({color, width, height, isTablet, thumbHeight}),
    [color, width, height, isTablet, thumbHeight],
  );

  return (
    <Pressable onPress={onPress}>
      <CardWrapper containerStyles={styles.videoCardContainer}>
        <View style={styles.videoThumbnailContainer}>
          <Image
            source={{uri: videoData?.thumbnail}}
            style={styles.videoItemThumbnail}
            fadeDuration={0}
          />
          <Typography type="bodyS" textStyles={styles.duration}>
            {formatTime(videoData?.duration)}
          </Typography>
        </View>

        <Typography numberOfLines={2} textStyles={styles.title} type="bodyLBold">
          {videoData?.title}
        </Typography>
      </CardWrapper>
    </Pressable>
  );
};

export default VideoItem;
