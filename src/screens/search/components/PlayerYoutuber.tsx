import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import YoutubePlayer, { PLAYER_STATES } from 'react-native-youtube-iframe';
import { Typography } from 'molecules';
import { formatCount, timeAgo } from 'utils';
import { useTranslation } from 'react-i18next';
import { searchStyles } from '../search-styles.ts';
import { KidsVideoItem } from 'models';

export interface IPlayerYoutuberProps {
  videoData: KidsVideoItem | null;
  isVisible: boolean;
}

const PlayerYoutuber: FC<IPlayerYoutuberProps> = ({ videoData, isVisible }) => {
  const [playing, setPlaying] = useState(false);
  const {t} = useTranslation();

  const playerKey = useMemo(
    () => `${videoData?.youtubeId ?? 'no-id'}-${isVisible ? 'open' : 'closed'}`,
    [videoData?.youtubeId, isVisible],
  );
  useEffect(() => {
    if (isVisible && videoData?.youtubeId) {
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
    if (isVisible) {
      setTimeout(() => setPlaying(true), 150);
    }
  }, [isVisible]);

  return (
    <Fragment>
      <View style={searchStyles({}).videoYoutubeContainer}>
        {isVisible && videoData?.youtubeId ? (
          <YoutubePlayer
            key={playerKey}
            height={230}
            play={playing}
            mute={false} // iOS requires mute for autoplay
            videoId={videoData?.youtubeId}
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
          />
        ) : null}

        <View style={searchStyles({playing}).hideYoutubeContainer}/>
      </View>

      <View style={searchStyles({}).videoInfoContainer}>
        <Typography type={'bodyLBold'}>
          {videoData?.title}
        </Typography>

        <Typography
          numberOfLines={1}
          type="caption"
          textColor="text_secondary">
          {formatCount(videoData?.viewCount!)} {t('video_view')} • ${timeAgo(videoData?.publishedAt!)}
        </Typography>
      </View>
    </Fragment>


  );
};

export default PlayerYoutuber;
