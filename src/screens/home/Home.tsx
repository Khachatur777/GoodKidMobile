import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
} from '@react-navigation/native';
import {BackgroundWrapper, GoodKidLogo, Icon, Typography} from 'molecules';
import {homeStyles} from './home-styles';
import {VideoItem} from './components';
import {useGetAllHomeVideosMutation} from 'rtk/api/home.ts';
import {KidsVideoItem} from 'models';
import {useSelector} from 'react-redux';
import {getFilterDataState, getIsChildState, getUserState, isLoggedInSelector} from 'rtk';
import {t} from 'i18next';
import { isTablet, thumbHeight } from 'utils';
import { CategoriesFilter } from 'app-constants/shared.ts';

import {useContext} from 'react';
import {ThemeContext} from 'theme';

export interface HomeProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    {
      params: {extraData: string};
    },
    'params'
  >;
}

const PREFETCH_AHEAD = 10;

const Home: FC<HomeProps> = ({navigation}) => {
  const [videosGet] = useGetAllHomeVideosMutation();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const isChild = useSelector(getIsChildState);
  const filter = useSelector(getFilterDataState);
  const user = useSelector(getUserState);
  const {color} = useContext(ThemeContext);

  const [cursor, setCursor] = useState<string>('');
  const [chipCategory, setChipCategory] = useState<number | null>(null);
  const [videos, setVideos] = useState<KidsVideoItem[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  const loadMoreTimeoutRef = useRef<number | null>(null);
  const {width, height} = useWindowDimensions();

  const prefetchedRef = useRef<Set<string>>(new Set());

  const styles = useMemo(() => homeStyles({color, width, height, isTablet, thumbHeight}),
    [color, width, height, isTablet, thumbHeight]);

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

        if (isLoggedIn && !isChild) {
          filter.categories?.length && (data.categories = filter.categories);
          filter.age && (data.age = filter.age);
          filter.language && (data.language = filter.language);
        }

        // Чип категории на главной перекрывает категории из фильтра
        if (chipCategory) {
          data.categories = [chipCategory];
        }

        const response: any = await videosGet(data);

        if (response?.data?.success) {
          const newItems: KidsVideoItem[] = response.data.items || [];

          if (isLoadMore) {
            setVideos(prev => [...prev, ...newItems]);
          } else {
            setVideos(newItems);
            // при полном обновлении можно очистить prefetch cache,
            // чтобы не разрастался бесконечно при смене фильтров
            prefetchedRef.current = new Set();
          }

          setCursor(response.data.nextCursor || '');
          setHasMore(!!response.data.hasMore);

          // Быстрый prefetch первых следующих (чтобы сразу не лагало при первом скролле)
          newItems.slice(3, 3 + PREFETCH_AHEAD).forEach(v => {
            const url = v?.thumbnail;
            if (url && !prefetchedRef.current.has(url)) {
              prefetchedRef.current.add(url);
              Image.prefetch(url);
            }
          });
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
    [videosGet, isLoggedIn, filter, chipCategory],
  );

  useEffect(() => {
    // не чистим videos, чтобы не мигало пусто
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
      }, 800) as unknown as number;
    }
  }, [hasMore, isLoadingMore, isRefreshing, cursor, getVideos]);

  const onRefresh = useCallback(() => {
    setCursor('');
    setHasMore(false);
    getVideos({isRefresh: true, cursorParam: ''});
  }, [getVideos]);

  const greetingName = isChild
    ? t('kid_home_greeting', {name: user?.name})
    : user?.profile?.firstName
      ? `${t('home_greeting')}, ${user.profile.firstName}`
      : t('home_greeting');

  const renderVideItem = useCallback(
    ({item}: {item: KidsVideoItem}) => (
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
        <ActivityIndicator size="small" color={color('accent_active')} />
      </View>
    );
  }, [isLoadingMore, styles.activeIndicatorContainer, color]);

  // Prefetch thumbnails AHEAD of current visible index (scroll-based)
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 15,
  }).current;

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (!viewableItems?.length) return;

    const maxIndex = Math.max(...viewableItems.map((v: any) => v.index ?? 0));

    const start = maxIndex + 1;
    const end = start + PREFETCH_AHEAD;

    const slice = videos.slice(start, end);

    for (const v of slice) {
      const url = v?.thumbnail;
      if (!url) continue;

      if (!prefetchedRef.current.has(url)) {
        prefetchedRef.current.add(url);
        Image.prefetch(url);
      }
    }
  }).current;

  return (
    <BackgroundWrapper
      backgroundColor="bg_primary"
      includesSafeArea
    >
      <View style={styles.headerRow}>
        <View style={styles.logoRow}>
          <GoodKidLogo size={34} />
          <Typography type="title3">GoodKid</Typography>
        </View>

        <Pressable
          style={styles.searchButton}
          onPress={() => navigation.navigate('SearchScreen')}
        >
          <Icon name="SearchLgIcon" color="icon_secondary" width={22} height={22} />
        </Pressable>
      </View>

      <View style={styles.greetingContainer}>
        <Typography type="bodyM" textColor="text_secondary">
          {greetingName}
        </Typography>
        <Typography type="titleL">{t('home_picked_today')}</Typography>
      </View>

      {isChild ? null : (
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <Pressable
            style={[styles.chip, chipCategory === null && styles.chipActive]}
            onPress={() => setChipCategory(null)}
          >
            <Typography
              type={chipCategory === null ? 'bodySBold' : 'bodyS'}
              textColor={chipCategory === null ? 'text_inverted' : 'text_secondary'}
            >
              {t('all')}
            </Typography>
          </Pressable>

          {CategoriesFilter.map(category => {
            const isActive = chipCategory === category.id;
            return (
              <Pressable
                key={category.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setChipCategory(isActive ? null : category.id)}
              >
                <Typography
                  type={isActive ? 'bodySBold' : 'bodyS'}
                  textColor={isActive ? 'text_inverted' : 'text_secondary'}
                >
                  {t(category.name)}
                </Typography>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      )}

      {isInitialLoading && !videos.length ? null : videos.length ? (
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
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={color('accent_active')}
              colors={[color('accent_active')]}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Typography type="bodyL" textColor="text_secondary">
            {t('video_empty_data')}
          </Typography>
        </View>
      )}
    </BackgroundWrapper>
  );
};

export default Home;
