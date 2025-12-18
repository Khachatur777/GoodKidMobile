import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {BackgroundWrapper} from 'molecules';
import {playVideoListStyles} from './play-video-list-styles.ts';
import {PlayerYoutuber} from './components';
import {getFilterDataState, isLoggedInSelector, useGetAllHomeVideosMutation} from 'rtk';
import {KidsVideoItem} from 'models';
import {useSelector} from 'react-redux';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {YoutubeItemSkeleton} from "organisms";
import {NavigationProp, RouteProp, useFocusEffect} from "@react-navigation/native";
import {VideoItem} from "screens";
import {usePreventSwipeBackOnAndroid} from "hooks";

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
      <VideoItem
        videoData={item}
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
      <View style={playVideoListStyles({}).activeIndicatorContainer}>
        <ActivityIndicator size="small" color="#007AFF"/>
      </View>
    );
  }, [isLoadingMore]);

  return (
    <BackgroundWrapper
      backgroundColor="bg_primary"
      containerStyles={playVideoListStyles({}).modalContainer}
    >

      <PlayerYoutuber videoData={videoData}/>

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
        />
        :
        <YoutubeItemSkeleton count={3}/>
      }

    </BackgroundWrapper>
  );
};

export default PlayVideoList;
