import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  View,
  RefreshControl, Platform,
} from 'react-native';
import {NavigationProp, RouteProp, useFocusEffect} from '@react-navigation/native';
import {BackgroundWrapper, Icon} from 'molecules';
import {homeStyles} from './home-styles';
import {PlayVideoListModal, VideoItem} from './components';
import {useGetAllHomeVideosMutation} from 'rtk/api/home.ts';
import {KidsVideoItem} from 'models';
import {useSelector} from 'react-redux';
import {getConfigDataState, getFilterDataState, isLoggedInSelector} from 'rtk';

export interface HomeProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    {
      params: { extraData: string };
    },
    'params'
  >;
}

const Home: FC<HomeProps> = ({ navigation }) => {
  const [videosGet] = useGetAllHomeVideosMutation();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const filter = useSelector(getFilterDataState);
  const config = useSelector(getConfigDataState);

  const [isVisible, setIsVisible] = useState(false);
  const [cursor, setCursor] = useState<string>('');
  const [videos, setVideos] = useState<KidsVideoItem[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [chooseVideo, setChooseVideo] = useState<KidsVideoItem | null>(null);
  const loadMoreTimeoutRef = useRef<number | null>(null);

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
        if (isLoadMore) {
          setIsLoadingMore(true);
        }
        if (isRefresh) {
          setIsRefreshing(true);
        }

        const data: any = {
          showModal: true,
          showLoader: true,
        };

        if (isLoadMore && cursorParam) {
          data.cursor = cursorParam;
        }

        if (isLoggedIn) {
          filter.categories?.length && (data.categories = filter.categories);
          filter.age && (data.age = filter.age);
          filter.language && (data.language = filter.language);
        }

        if(!config?.iosFilterEnable && Platform.OS === 'ios'){
          data.language = 'hy'
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

  // initial load
  useEffect(() => {
    getVideos();
  }, [getVideos]);

  // refetch on filters change
  useEffect(() => {
    if (isLoggedIn) {
      setVideos([]);
      setCursor('');
      setHasMore(false);
      getVideos();
    }
  }, [filter.categories, filter.age, filter.language, isLoggedIn, getVideos]);

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
        getVideos({ isLoadMore: true, cursorParam: currentCursor });
        loadMoreTimeoutRef.current = null;
      }, 1000);
    }
  }, [hasMore, isLoadingMore, isRefreshing, cursor, getVideos]);

  const onRefresh = useCallback(() => {
    // сброс перед обновлением
    setCursor('');
    setHasMore(false);
    getVideos({ isRefresh: true, cursorParam: '' });
  }, [getVideos]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        renderRightSection: () => (
          <View style={homeStyles({}).rightHeaderContainer}>
            <Pressable onPress={() => navigation.navigate('SearchScreen')}>
              <Icon name={'SearchLgIcon'} color={'icon_tertiary'} />
            </Pressable>
          </View>
        ),
      });
    }, [navigation]),
  );

  const renderVideItem = useCallback(
    ({ item }: { item: KidsVideoItem }) => (
      <VideoItem
        videoData={item}
        onPress={() => {
          setChooseVideo(item);
          setIsVisible(true);
        }}
      />
    ),
    [],
  );

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={homeStyles({}).activeIndicatorContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }, [isLoadingMore]);

  return (
    <BackgroundWrapper
      backgroundColor="bg_primary"
      containerStyles={{ paddingBottom: 80 }}
    >
      <FlatList
        data={videos}
        renderItem={renderVideItem}
        keyExtractor={(item) => `${item.keyExtractor}`}
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

      {isVisible && (
        <PlayVideoListModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          videoDataProps={chooseVideo}
          cursorProps={cursor}
        />
      )}
    </BackgroundWrapper>
  );
};

export default Home;
