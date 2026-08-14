import {FC, useContext, useMemo} from 'react';
import {Image, Pressable, View, useWindowDimensions} from 'react-native';
import {Typography} from 'molecules';
import { formatTime, isTablet, thumbHeight } from 'utils';
import {ThemeContext} from 'theme';
import {KidsVideoItem} from 'models';
import {homeStyles} from '../home-styles';
import {AgeFilter, CategoriesFilter} from 'app-constants/shared.ts';
import {useTranslation} from 'react-i18next';

export interface IVideoItemProps {
  videoData: KidsVideoItem;
  onPress: () => void;
}

const VideoItem: FC<IVideoItemProps> = ({videoData, onPress}) => {
  const {color} = useContext(ThemeContext);
  const {width, height} = useWindowDimensions();
  const {t} = useTranslation();

  const styles = useMemo(
    () => homeStyles({color, width, height, isTablet, thumbHeight}),
    [color, width, height, isTablet, thumbHeight],
  );

  const categoryName = useMemo(() => {
    const category = CategoriesFilter.find(
      c => c.id === videoData?.categoryIds?.[0],
    );
    return category ? t(category.name) : null;
  }, [videoData?.categoryIds, t]);

  const ageName = useMemo(() => {
    const age = AgeFilter.find(a => a.id === videoData?.mocAgeIds?.[0]);
    return age ? `${age.name} ${t('age')}` : null;
  }, [videoData?.mocAgeIds, t]);

  return (
    <Pressable onPress={onPress} style={styles.videoCardContainer}>
      <View style={styles.videoThumbnailContainer}>
        <Image
          source={{uri: videoData?.thumbnail}}
          style={styles.videoItemThumbnail}
          fadeDuration={0}
        />
        <Typography type="bodySBold" textStyles={styles.duration}>
          {formatTime(videoData?.duration)}
        </Typography>
      </View>

      <Typography numberOfLines={2} textStyles={styles.title} type="bodyLBold">
        {videoData?.title}
      </Typography>

      {categoryName || ageName ? (
        <View style={styles.metaRow}>
          {categoryName ? (
            <View style={styles.categoryChip}>
              <Typography type="bodySBold" textColor="accent_active">
                {categoryName}
              </Typography>
            </View>
          ) : null}

          {ageName ? (
            <Typography type="bodyS" textColor="text_secondary">
              {ageName}
            </Typography>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
};

export default VideoItem;
