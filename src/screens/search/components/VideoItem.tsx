import { FC, useContext } from 'react';
import { CardWrapper, Typography } from 'molecules';
import { searchStyles } from '../search-styles.ts';
import { Image, Pressable, View } from 'react-native';
import { formatCount, formatTime, timeAgo } from 'utils';
import { ThemeContext } from 'theme';
import { Cell } from 'organisms';
import { useTranslation } from 'react-i18next';
import { KidsVideoItem } from 'models';

export interface IVideoItemProps {
  videoData: KidsVideoItem;
  onPress: () => void;
}

const VideoItem: FC<IVideoItemProps> = ({ videoData, onPress }) => {
  const { color } = useContext(ThemeContext);
  const {t} = useTranslation();

  return (
    <Pressable onPress={onPress}>
      <CardWrapper containerStyles={searchStyles({}).videoCardContainer}>
        <View style={searchStyles({}).videoThumbnailContainer}>

          <Image source={{ uri: videoData?.thumbnail }} style={searchStyles({}).videoItemThumbnail} />

          <Typography type={'bodyS'}
                      textStyles={searchStyles({ color }).duration}>{formatTime(videoData?.duration)}</Typography>
        </View>

        <Cell
          type={'avatar'}
          source={{ uri: videoData?.channelThumbnail }}
          showArrowIcon={false}
          title={videoData?.title}
          description={`${formatCount(videoData?.viewCount)} ${t('video_view')} • ${timeAgo(videoData?.publishedAt)}`}
        />
      </CardWrapper>
    </Pressable>

  );
};

export default VideoItem;
