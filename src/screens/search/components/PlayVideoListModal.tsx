import { Dispatch, FC, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { BackgroundWrapper, Modal, Spinner } from 'molecules';
import { searchStyles } from '../search-styles.ts';
import VideoItem from './VideoItem.tsx';
import { FlatList } from 'react-native-gesture-handler';
import PlayerYoutuber from './PlayerYoutuber.tsx';
import { getFilterDataState, isLoggedInSelector, useGetAllHomeVideosMutation } from 'rtk';
import { KidsVideoItem } from 'models';
import { useSelector } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';

export interface PlayVideoListModalProps {
  videoDataProps: KidsVideoItem | null;
  isVisible: boolean;
  cursorProps: string;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}


const PlayVideoListModal: FC<PlayVideoListModalProps> = ({ videoDataProps, isVisible, setIsVisible, cursorProps = '' }) => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const filter = useSelector(getFilterDataState);

  const [videoData, setVideoData] = useState<KidsVideoItem | null>(null)
  const [videosGet] = useGetAllHomeVideosMutation();
  const [cursor, setCursor] = useState<string>(cursorProps);
  const [videos, setVideos] = useState<KidsVideoItem[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadMoreTimeoutRef = useRef<number | null>(null);

  const renderVideItem = useCallback(
    ({ item }: { item: KidsVideoItem }) => (
      <VideoItem
        videoData={item}
        onPress={() => {
          setVideoData(item)
        }}
      />
    ),
    [],
  );

  const getVideos = useCallback(async (isLoadMore: boolean = false) => {
    try {

      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      console.log(videoData, 'videoData');
      const data: any = {
        showModal: true,
        exceptVideoId: videoData?._id
      };

      if(cursor){
        data.cursor = cursor
      }

      if (isLoggedIn) {
        filter.categories?.length ? data.categories = filter.categories : null;
        filter.age ? data.age = filter.age : null;
        filter.language ? data.language = filter.language : null;
      }
      console.log(data, 'data');
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
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [filter, cursor, isLoggedIn, videosGet, videoData]);

  useEffect(() => {
    // if (isLoggedIn) {
    //   setVideos([]);
    //   setCursor('');
    //   setHasMore(false);
    // }
    setVideoData(videoDataProps!)
    getVideos(false);
  }, [filter.categories, filter.age, videoDataProps, filter.language]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }

      loadMoreTimeoutRef.current = setTimeout(() => {
        getVideos(true);
        loadMoreTimeoutRef.current = null;
      }, 1000);
    }
  }, [hasMore, isLoadingMore, isLoading, getVideos]);


  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={searchStyles({}).activeIndicatorContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }, [isLoadingMore]);

  if (isLoading && videos.length === 0) {
    return (
      <BackgroundWrapper backgroundColor="bg_secondary">
        <View style={searchStyles({}).spinnerContainer}>
          <Spinner />
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <Modal
      type="bottom-sheet"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      contentContainerStyles={searchStyles({}).modalContainer}
    >

      <PlayerYoutuber videoData={videoData} isVisible={isVisible} />

      <FlatList
        data={videos}
        renderItem={renderVideItem}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </Modal>
  );
};

export default PlayVideoListModal;
