import {FC, Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Platform, View} from 'react-native';
import Video from 'react-native-video';
import {Typography} from 'molecules';
import {playVideoListStyles} from '../play-video-list-styles.ts';
import {KidsVideoItem} from 'models';
import {baseFileUrl} from 'configs';

export interface IPlayerYoutuberProps {
  videoData: KidsVideoItem | null;
  isVisible: boolean;
}

const Player: FC<IPlayerYoutuberProps> = ({videoData, isVisible}) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(Platform.OS === 'ios');
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const playerKey = useMemo(
    () => `${videoData?.youtubeId ?? 'no-id'}-${isVisible ? 'open' : 'closed'}`,
    [videoData?.youtubeId, isVisible],
  );

  const videoUrl = useMemo(() => {
    if (!videoData?.youtubeId) return null;
    return `${baseFileUrl}/file/video/${videoData.youtubeId}.mp4`;
  }, [videoData?.youtubeId]);

  useEffect(() => {
    setIsPlayerReady(false);

    if (isVisible && videoUrl) {
      setMuted(Platform.OS === 'ios');
      const t = setTimeout(() => setPlaying(true), 250);
      return () => clearTimeout(t);
    }

    setPlaying(false);
  }, [isVisible, videoUrl]);

  const onEnd = useCallback(() => {
    setPlaying(false);
  }, []);

  const onLoad = useCallback(() => {
    setIsPlayerReady(true);

    if (isVisible) {
      setTimeout(() => {
        setMuted(false);
        setPlaying(true);
      }, 1500);
    }
  }, [isVisible]);

  return (
    <Fragment>
      <View style={playVideoListStyles({}).videoYoutubeContainer}>
        {videoData?.thumbnail && (!isPlayerReady || !isVisible) && (
          <Image
            source={{uri: videoData.thumbnail}}
            style={playVideoListStyles({}).videoThumbnail}
            resizeMode="cover"
          />
        )}

        {isVisible && videoUrl ? (
          <Video
            key={playerKey}
            source={{uri: videoUrl}}
            style={
              !isPlayerReady
                ? {position: 'absolute', opacity: 0, width: '100%', height: 230}
                : {width: '100%', height: 230}
            }
            paused={!playing}
            muted={muted}
            resizeMode="cover"
            onEnd={onEnd}
            onLoad={onLoad}
            controls
            repeat={false}
          />
        ) : null}

        <View
          style={
            Platform.OS === 'android'
              ? playVideoListStyles({playing}).hideYoutubeContainerAndroid
              : playVideoListStyles({playing}).hideYoutubeContainer
          }
        />
      </View>

      <View style={playVideoListStyles({}).videoInfoContainer}>
        <Typography type="bodyLBold">
          {videoData?.title}
        </Typography>
      </View>
    </Fragment>
  );
};

export default Player;
