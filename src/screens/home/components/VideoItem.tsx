import { FC, useContext } from 'react';
import { CardWrapper, Typography } from 'molecules';
import { homeStyles } from '../home-styles';
import { Image, Pressable, View } from 'react-native';
import { formatCount, formatTime, timeAgo } from 'utils';
import { ThemeContext } from 'theme';
import { Cell } from 'organisms';
import { useTranslation } from 'react-i18next';
import {KidsVideoItem} from "models";

export interface IVideoItemProps {
  videoData: KidsVideoItem;
  onPress: () => void;
}

const VideoItem: FC<IVideoItemProps> = ({ videoData, onPress }) => {
  const { color } = useContext(ThemeContext);
  const {t} = useTranslation();

  return (
    <Pressable onPress={onPress}>
      <CardWrapper containerStyles={homeStyles({}).videoCardContainer}>
        <View style={homeStyles({}).videoThumbnailContainer}>

          <Image source={{ uri: videoData?.thumbnail }} style={homeStyles({}).videoItemThumbnail} />

          <Typography type={'bodyS'}
                      textStyles={homeStyles({ color }).duration}>{formatTime(videoData?.duration)}</Typography>
        </View>

        <Typography numberOfLines={2} textStyles={homeStyles({}).title} type={"bodyLBold"}>{videoData?.title}</Typography>
      </CardWrapper>
    </Pressable>

  );
};

export default VideoItem;
