import {FC, Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {Dimensions, Image, Platform, View} from 'react-native';
import YoutubePlayer, {PLAYER_STATES} from 'react-native-youtube-iframe';
import {Spacing, Typography} from 'molecules';
import {playVideoListStyles} from '../play-video-list-styles.ts';
import {KidsVideoItem} from 'models';
import {t} from "i18next";

export interface IPlayerYoutuberProps {
  videoData: KidsVideoItem | null;
}

const PlayerYoutuber: FC<IPlayerYoutuberProps> = ({ videoData }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(Platform.OS === 'ios');
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const videoHeight = (windowWidth / 16) * 9;

  const playerKey = useMemo(
    () => `${videoData?.youtubeId ?? 'no-id'}`,
    [videoData?.youtubeId],
  );

  useEffect(() => {
    setIsPlayerReady(false);

    if (videoData?.youtubeId) {
      setMuted(Platform.OS === 'ios');
      const t = setTimeout(() => setPlaying(true), 250);
      return () => clearTimeout(t);
    }
    setPlaying(false);
  }, [ videoData?.youtubeId]);

  const onStateChange = useCallback((state: string) => {
    if (state === PLAYER_STATES.ENDED || state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const onReady = useCallback(() => {
    setIsPlayerReady(true);

      setTimeout(() => {
        setMuted(false);
        setPlaying(true);
      }, 1500);

  }, []);

  return (
    <Fragment>
      <View style={playVideoListStyles({}).videoYoutubeContainer}>
        {videoData?.thumbnail && (!isPlayerReady) && (
          <Image
            source={{ uri: videoData.thumbnail }}
            style={playVideoListStyles({videoHeight}).videoThumbnail}
            resizeMode="cover"
          />
        )}

        {Platform.OS === 'android' ?
        <View style={playVideoListStyles({ playing }).hideYoutubeHeader} />

          : null
        }

        {videoData?.youtubeId ? (
          <YoutubePlayer
            key={playerKey}
            height={videoHeight}
            play={playing}
            mute={muted} // iOS requires mute for autoplay
            videoId={videoData.youtubeId}
            onChangeState={onStateChange}
            onReady={onReady}
            forceAndroidAutoplay
            initialPlayerParams={{
              controls: true,
              modestbranding: true,
              disablekb: true,
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

        <View style={Platform.OS === 'android' ? playVideoListStyles({ playing }).hideYoutubeContainerAndroid : playVideoListStyles({ playing }).hideYoutubeContainer} />
      </View>

      <View style={playVideoListStyles({}).videoInfoContainer}>

        <Typography type={'bodyLBold'}>
          {videoData?.title}
        </Typography>

        <Spacing size={4} />

        <View>
          <Typography type={'description'} textColor={'text_tertiary'}>
            {t('source_title')}
          </Typography>

          <Typography type={'description'}  textColor={'text_tertiary'}>
            {t('source_description')}
          </Typography>

          <Typography type={'description'}  textColor={'text_tertiary'}>
            {t('source_note')}
          </Typography>

        </View>


      </View>
    </Fragment>
  );
};

export default PlayerYoutuber;
