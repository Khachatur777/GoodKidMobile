import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Platform, View, useWindowDimensions } from 'react-native';
import YoutubePlayer, { PLAYER_STATES } from 'react-native-youtube-iframe';
import { Typography } from 'molecules';
import { playVideoListStyles } from '../play-video-list-styles';
import { KidsVideoItem } from 'models';
import { controlsExtra, isTablet, playerHeight } from 'utils';

export interface IPlayerYoutuberProps {
  videoData: KidsVideoItem | null;
  onEnded: () => void;
}

const PlayerYoutuber: FC<IPlayerYoutuberProps> = ({ videoData, onEnded }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(Platform.OS === 'ios');
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const { width, height } = useWindowDimensions();


  const playerHeightWithControls = playerHeight + controlsExtra;

  const styles = useMemo(
    () =>
      playVideoListStyles({
        width,
        height,
        playerHeightWithControls,
        isTablet,
      }),
    [width, height, playerHeightWithControls, isTablet],
  );

  const playerKey = useMemo(
    () => `${videoData?.youtubeId ?? 'no-id'}`,
    [videoData?.youtubeId],
  );

  useEffect(() => {
    setIsPlayerReady(false);

    if (videoData?.youtubeId) {
      setMuted(Platform.OS === 'ios');
      const timer = setTimeout(() => setPlaying(true), 250);
      return () => clearTimeout(timer);
    }

    setPlaying(false);
  }, [videoData?.youtubeId]);

  const onStateChange = useCallback(
    (state: string) => {
      if (state === PLAYER_STATES.ENDED || state === 'ended') {
        setPlaying(false);
        onEnded?.();
      }
    },
    [onEnded],
  );

  const onReady = useCallback(() => {
    setIsPlayerReady(true);

    setTimeout(() => {
      setMuted(false);
      setPlaying(true);
    }, 800);
  }, []);

  return (
    <Fragment>
      <View style={[styles.videoYoutubeContainer]}>
        {!!videoData?.thumbnail && !isPlayerReady && (
          <Image
            source={{ uri: videoData.thumbnail }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
        )}

        {Platform.OS === 'android' ? (
          <View style={styles.hideYoutubeHeader} />
        ) : null}

        {!!videoData?.youtubeId && (
          <YoutubePlayer
            key={playerKey}
            height={playerHeightWithControls}
            play={playing}
            mute={muted}
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
              scrollEnabled: false,
              bounces: false,
              showsVerticalScrollIndicator: false,
              showsHorizontalScrollIndicator: false,
              overScrollMode: 'never',
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: false,
            }}
            webViewStyle={
              !isPlayerReady
                ? {
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: playerHeightWithControls,
                  }
                : { width: '100%', height: playerHeightWithControls }
            }
          />
        )}

        {!isTablet ? (
          <View
            style={
              Platform.OS === 'android'
                ? styles.hideYoutubeContainerAndroid
                : styles.hideYoutubeContainer
            }
          />
        ) : null}
      </View>

      <View style={styles.videoInfoContainer}>
        <Typography type="bodyLBold">{videoData?.title}</Typography>

        {/*<Spacing size={4} />*/}

        {/*<View>*/}
        {/*  <Typography type="description" textColor="text_tertiary">*/}
        {/*    {t('source_title')}*/}
        {/*  </Typography>*/}
        {/*  <Typography type="description" textColor="text_tertiary">*/}
        {/*    {t('source_description')}*/}
        {/*  </Typography>*/}
        {/*  <Typography type="description" textColor="text_tertiary">*/}
        {/*    {t('source_note')}*/}
        {/*  </Typography>*/}
        {/*</View>*/}
      </View>
    </Fragment>
  );
};

export default PlayerYoutuber;
