import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  View,
} from 'react-native';
import {NavigationProp, RouteProp, useFocusEffect} from '@react-navigation/native';
import {BackgroundWrapper, Icon, Typography} from 'molecules';
import {homeStyles} from './home-styles';
import {VideoItem} from './components';
import {useGetAllHomeVideosMutation} from 'rtk/api/home.ts';
import {KidsVideoItem} from 'models';
import {useSelector} from 'react-redux';
import {getFilterDataState, isLoggedInSelector} from 'rtk';
import {t} from 'i18next';

export interface HomeProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    {
      params: { extraData: string };
    },
    'params'
  >;
}

const Home: FC<HomeProps> = ({navigation}) => {
  const [videosGet] = useGetAllHomeVideosMutation();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const filter = useSelector(getFilterDataState);

  const [cursor, setCursor] = useState<string>('');
  const [videos, setVideos] = useState<KidsVideoItem[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const loadMoreTimeoutRef = useRef<number | null>(null);

  const styles = useMemo(() => homeStyles({}), []);

  const getVideos = useCallback(
    async (options?: {
      isLoadMore?: boolean;
      isRefresh?: boolean;
      cursorParam?: string | null;
    }) => {
      const {
        isLoadMore = false,
        isRefresh = false,
        cursorParam = null,
      } = options || {};

      try {
        if (!isLoadMore && !isRefresh) {
          setIsInitialLoading(true);
        }

        if (isLoadMore) {
          setIsLoadingMore(true);
        }

        if (isRefresh) {
          setIsRefreshing(true);
        }

        const data: any = {};

        // глобальный лоадер только на самый первый/обычный запрос
        if (!isLoadMore && !isRefresh) {
          data.showModal = true;
          data.showLoader = true;
        }

        if (isLoadMore && cursorParam) {
          data.cursor = cursorParam;
        }

        if (isLoggedIn) {
          filter.categories?.length && (data.categories = filter.categories);
          filter.age && (data.age = filter.age);
          filter.language && (data.language = filter.language);
        }

        const response: any = await videosGet(data);

        if (response?.data?.success) {
          if (isLoadMore) {
            setVideos(prevVideos => [...prevVideos, ...response.data.items]);
          } else {
            setVideos(response.data.items);
          }

          setCursor(response.data.nextCursor || '');
          setHasMore(!!response.data.hasMore);
        }
      } catch (e) {
        console.log(e);
      } finally {
        if (!isLoadMore && !isRefresh) {
          setIsInitialLoading(false);
        }

        if (isLoadMore) {
          setIsLoadingMore(false);
        }

        if (isRefresh) {
          setIsRefreshing(false);
        }
      }
    },
    [videosGet, isLoggedIn, filter],
  );

  useEffect(() => {
    setVideos([]);
    setCursor('');
    setHasMore(false);
    getVideos();
  }, [isLoggedIn, filter.categories, filter.age, filter.language, getVideos]);

  useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isRefreshing) {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }

      const currentCursor = cursor;

      loadMoreTimeoutRef.current = setTimeout(() => {
        getVideos({isLoadMore: true, cursorParam: currentCursor});
        loadMoreTimeoutRef.current = null;
      }, 1000) as unknown as number;
    }
  }, [hasMore, isLoadingMore, isRefreshing, cursor, getVideos]);

  const onRefresh = useCallback(() => {
    setCursor('');
    setHasMore(false);
    getVideos({isRefresh: true, cursorParam: ''});
  }, [getVideos]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        renderRightSection: () => (
          <View style={styles.rightHeaderContainer}>
            <Pressable onPress={() => navigation.navigate('SearchScreen')}>
              <Icon name="SearchLgIcon" color="icon_inverted_header" />
            </Pressable>
          </View>
        ),
      });
    }, [navigation, styles.rightHeaderContainer]),
  );

  const renderVideItem = useCallback(
    ({item}: { item: KidsVideoItem }) => (
      <VideoItem
        videoData={item}
        onPress={() => {
          navigation.navigate('PlayVideoListScreen', {
            videoDataProps: item,
            cursorProps: cursor,
          });
        }}
      />
    ),
    [navigation, cursor],
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.activeIndicatorContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }, [isLoadingMore, styles.activeIndicatorContainer]);

  return (
    <BackgroundWrapper
      backgroundColor="bg_primary"
      containerStyles={{paddingBottom: 80}}
    >
      {isInitialLoading ? null : videos.length ? (
        <FlatList
          data={videos}
          renderItem={renderVideItem}
          keyExtractor={item => `${item.keyExtractor}`}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Typography type="bodyL" textColor="red_500">
            {t('video_empty_data')}
          </Typography>
        </View>
      )}
    </BackgroundWrapper>
  );
};

export default Home;
