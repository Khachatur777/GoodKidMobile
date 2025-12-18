import {FC, useContext, useMemo} from 'react';
import {CardWrapper, Typography} from 'molecules';
import {homeStyles} from '../home-styles';
import {Image, Pressable, View} from 'react-native';
import {formatTime} from 'utils';
import {ThemeContext} from 'theme';
import {KidsVideoItem} from 'models';

export interface IVideoItemProps {
  videoData: KidsVideoItem;
  onPress: () => void;
}

const VideoItem: FC<IVideoItemProps> = ({videoData, onPress}) => {
  const {color} = useContext(ThemeContext);

  const styles = useMemo(() => homeStyles({color}), [color]);

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
