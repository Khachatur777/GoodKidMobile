import {FC, Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {Image, Platform, View} from 'react-native';
import YoutubePlayer, {PLAYER_STATES} from 'react-native-youtube-iframe';
import {Typography} from 'molecules';
import {useTranslation} from 'react-i18next';
import {homeStyles} from '../home-styles';
import {KidsVideoItem} from 'models';

export interface IPlayerYoutuberProps {
  videoData: KidsVideoItem | null;
  isVisible: boolean;
}

const PlayerYoutuber: FC<IPlayerYoutuberProps> = ({ videoData, isVisible }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(Platform.OS === 'ios');
  const [isPlayerReady, setIsPlayerReady] = useState(false); // <- для переключения thumbnail / видео

  const { t } = useTranslation();

  const playerKey = useMemo(
    () => `${videoData?.youtubeId ?? 'no-id'}-${isVisible ? 'open' : 'closed'}`,
    [videoData?.youtubeId, isVisible],
  );

  useEffect(() => {
    setIsPlayerReady(false);

    if (isVisible && videoData?.youtubeId) {
      setMuted(Platform.OS === 'ios');
      const t = setTimeout(() => setPlaying(true), 250);
      return () => clearTimeout(t);
    }
    setPlaying(false);
  }, [isVisible, videoData?.youtubeId]);

  const onStateChange = useCallback((state: string) => {
    if (state === PLAYER_STATES.ENDED || state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const onReady = useCallback(() => {
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
      <View style={homeStyles({}).videoYoutubeContainer}>
        {videoData?.thumbnail && (!isPlayerReady || !isVisible) && (
          <Image
            source={{ uri: videoData.thumbnail }}
            style={homeStyles({}).videoThumbnail}
            resizeMode="cover"
          />
        )}

        {isVisible && videoData?.youtubeId ? (
          <YoutubePlayer
            key={playerKey}
            height={230}
            play={playing}
            mute={muted} // iOS requires mute for autoplay
            videoId={videoData.youtubeId}
            onChangeState={onStateChange}
            onReady={onReady}
            forceAndroidAutoplay
            initialPlayerParams={{
              controls: true,
              modestbranding: true,
              rel: false,
            }}
            webViewProps={{
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
            }}
            webViewStyle={
              !isPlayerReady
                ? { position: 'absolute', opacity: 0, width: '100%', height: 230 }
                : { width: '100%', height: 230 }
            }
          />
        ) : null}

        <View style={Platform.OS === 'android' ? homeStyles({ playing }).hideYoutubeContainerAndroid : homeStyles({ playing }).hideYoutubeContainer} />
      </View>

      <View style={homeStyles({}).videoInfoContainer}>
        <Typography type={'bodyLBold'}>
          {videoData?.title}
        </Typography>

      </View>
    </Fragment>
  );
};

export default PlayerYoutuber;
