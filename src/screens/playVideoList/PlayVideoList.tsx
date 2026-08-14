import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {BackgroundWrapper} from 'molecules';
import {playVideoListStyles} from './play-video-list-styles.ts';
import {PlayerYoutuber} from './components';
import {getFilterDataState, isLoggedInSelector, useGetAllHomeVideosMutation} from 'rtk';
import {KidsVideoItem} from 'models';
import {useSelector} from 'react-redux';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import {YoutubeItemSkeleton, VideoRow} from "organisms";
import {NavigationProp, RouteProp, useFocusEffect} from "@react-navigation/native";
import {usePreventSwipeBackOnAndroid} from "hooks";
import { formatTime, isTablet } from 'utils';
import {Icon, Typography} from 'molecules';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {AgeFilter, CategoriesFilter} from 'app-constants/shared.ts';
import {useContext} from 'react';
import {ThemeContext} from 'theme';

export interface PlayVideoListProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    {
      params: {
        videoDataProps: KidsVideoItem | null;
        cursorProps: string;
      };
    },
    'params'
  >;
}

const PlayVideoList: FC<PlayVideoListProps> = ({navigation, route}) => {
  usePreventSwipeBackOnAndroid()
  const insets = useSafeAreaInsets();
  const {t} = useTranslation();
  const {color} = useContext(ThemeContext);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const filter = useSelector(getFilterDataState);
  const videoDataProps = route?.params?.videoDataProps;

  const [videoData, setVideoData] = useState<KidsVideoItem | null>(null)
  const [videosGet] = useGetAllHomeVideosMutation();
  const [cursor, setCursor] = useState<string>(route?.params?.cursorProps);
  const [videos, setVideos] = useState<KidsVideoItem[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreTimeoutRef = useRef<number | null>(null);

  const { width, height } = useWindowDimensions();

  const styles = useMemo(
    () =>
      playVideoListStyles({ color, width, height, isTablet }),
    [color, width, height, isTablet],
  );

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        gestureEnabled: false,
      });
    }, []),
  );

  const getVideos = useCallback(async (isLoadMore: boolean = false, id?: string) => {
    try {

      if (isLoadMore) {
        setIsLoadingMore(true);
      }

      const data: any = {
        exceptVideoId: id
      };

      if (cursor) {
        data.cursor = cursor
      }

      if (isLoggedIn) {
        filter.categories?.length ? data.categories = filter.categories : null;
        filter.age ? data.age = filter.age : null;
        filter.language ? data.language = filter.language : null;
      }

      const response = await videosGet(data);

      if (response?.data?.success) {
        if (isLoadMore) {
          setVideos(prevVideos => [...prevVideos, ...response?.data?.items]);
        } else {
          setVideos(response?.data?.items);
        }
        setCursor(response?.data?.nextCursor);
        setHasMore(response?.data?.hasMore);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoadingMore(false);
    }
  }, [filter, cursor, isLoggedIn, videosGet, videoData]);

  const renderVideItem = useCallback(
    ({item}: { item: KidsVideoItem }) => (
      <VideoRow
        title={item?.title}
        thumbnail={item?.thumbnail}
        meta={formatTime(item?.duration)}
        size="medium"
        onPress={() => {
          setVideoData(item)
          getVideos(false, item?._id);
        }}
      />
    ),
    [],
  );

  useEffect(() => {
    setVideoData(videoDataProps!)
    getVideos(false, videoDataProps?._id!);
  }, [filter.categories, filter.age, videoDataProps, filter.language]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }

      loadMoreTimeoutRef.current = setTimeout(() => {
        getVideos(true, videoData?._id);
        loadMoreTimeoutRef.current = null;
      }, 1000);
    }
  }, [hasMore, isLoadingMore, getVideos]);


  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.activeIndicatorContainer}>
        <ActivityIndicator size="small" color={color('accent_active')}/>
      </View>
    );
  }, [isLoadingMore, color]);


  const handleEnded = useCallback(() => {
    setVideoData(videos?.[0])
    getVideos(false, videos?.[0]?._id);

  }, [getVideos]);

  const categoryName = (() => {
    const category = CategoriesFilter.find(
      c => c.id === videoData?.categoryIds?.[0],
    );
    return category ? t(category.name) : null;
  })();

  const ageName = (() => {
    const age = AgeFilter.find(a => a.id === videoData?.mocAgeIds?.[0]);
    return age ? `${age.name} ${t('age')}` : null;
  })();

  return (
    <BackgroundWrapper
      backgroundColor="bg_primary"
      containerStyles={styles.modalContainer}
    >

      <View style={[styles.darkHeader, {paddingTop: insets.top}]}>
        <Pressable style={styles.backRow} onPress={() => navigation.goBack()}>
          <Icon name="ChevronLeft" color="grey_0" />
          <Typography type="bodyBold" textColor="grey_0">
            {t('back')}
          </Typography>
        </Pressable>

        <PlayerYoutuber videoData={videoData} onEnded={handleEnded}/>
      </View>

      <View style={styles.infoContainer}>
        <Typography type="title3" numberOfLines={2}>
          {videoData?.title}
        </Typography>

        {categoryName || ageName ? (
          <View style={styles.chipsRow}>
            {categoryName ? (
              <View style={styles.categoryChip}>
                <Typography type="bodySBold" textColor="accent_active">
                  {categoryName}
                </Typography>
              </View>
            ) : null}

            {ageName ? (
              <View style={styles.ageChip}>
                <Typography type="bodyS" textColor="text_secondary">
                  {ageName}
                </Typography>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      <Typography type="bodyLBold" textStyles={styles.upNextLabel}>
        {t('up_next')}
      </Typography>

      {videos?.length ?
        <FlatList
          data={videos}
          renderItem={renderVideItem}
          keyExtractor={(item, index) => `${item.keyExtractor}`}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          contentContainerStyle={styles.upNextList}
        />
        :
        <YoutubeItemSkeleton count={3}/>
      }

    </BackgroundWrapper>
  );
};

export default PlayVideoList;
