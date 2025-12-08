import {FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, TextInput, View} from 'react-native';
import {NavigationProp, RouteProp, useFocusEffect,} from '@react-navigation/native';
import {BackgroundWrapper, Icon, Spinner} from 'molecules';
import {searchStyles} from './search-styles.ts';
import {t} from 'i18next';
import {ThemeContext} from 'theme';
import {useGetAllHomeVideosMutation, useGetSearchTitleVideosMutation,} from 'rtk';
import {VideoItem} from 'screens';
import {Cell} from 'organisms';
import {useSelector} from 'react-redux';
import {getFilterDataState, isLoggedInSelector} from 'rtk';

export interface SearchProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    {
      params: { extraData: string };
    },
    'params'
  >;
}

const Search: FC<SearchProps> = ({ navigation }) => {

  const { color } = useContext(ThemeContext);

  const [getVideos] = useGetAllHomeVideosMutation();
  const [getSearchTitleVideos] = useGetSearchTitleVideosMutation();
  const filter = useSelector(getFilterDataState);
  const isLoggedIn = useSelector(isLoggedInSelector);

  const [cursor, setCursor] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [videos, setVideos] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceRef = useRef<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const submitSearch = useCallback(async (term?: string) => {
    const value = (term ?? searchText).trim();

    if (!value) return;

    setShowResults(true);

    setIsLoading(true);

    try {
      const data: any = {
        showModal: true,
        limit: 10,
        search: value
      };

      if(cursor){
        data.cursor = cursor
      }

      if (isLoggedIn) {
        filter.categories?.length ? data.categories = filter.categories : null;
        filter.age ? data.age = filter.age : null;
        filter.language ? data.language = filter.language : null;
      }

      const response = await getVideos(data);

      if (response?.data?.success) {
        if (hasMore) {
          setVideos(prevVideos => [...prevVideos, ...response?.data?.items]);
        } else {
          setVideos(response?.data?.items);
        }
        setCursor(response?.data?.nextCursor);
        setHasMore(response?.data?.hasMore);
      } else {
        setVideos([]);
      }
    } catch (e) {
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [getVideos, searchText]);


  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        renderRightSection: () => (
          <View style={searchStyles({color}).rightHeaderContainer}>
            <TextInput
              value={searchText}
              onChangeText={e => {
                setSearchText(e);
                setShowResults(false);
              }}
              placeholder={t('search_placeholder')}
              placeholderTextColor={color?.('grey_0')}
              style={searchStyles({color}).searchInput}
              returnKeyType={'search'}
              onSubmitEditing={() => submitSearch()}
            />

            <Pressable onPress={() => submitSearch()}>
              <Icon name={'SearchLgIcon'} color={'grey_0'} />
            </Pressable>
          </View>
        ),
      });
    }, [navigation, searchText, submitSearch]),
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = searchText.trim();
    if (!trimmed || trimmed.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = (setTimeout(async () => {
      try {
        const data: any = {
          showModal: true,
          search: trimmed
        };
        const response = await getSearchTitleVideos(data);
        setShowResults(false);

        if (response?.data?.success) setSuggestions(response?.data?.items || []);
        else setSuggestions([]);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 350) as unknown) as number;

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchText, getVideos]);

  return (
    <BackgroundWrapper backgroundColor="bg_secondary" containerStyles={{paddingBottom: 80}}>
      {!showResults ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item: any) => item}
          renderItem={({ item }) => (
            <Cell
              type="icon"
              iconName={'SearchLgIcon'}
              showArrowIcon={false}
              title={item || ''}
              onPress={() => submitSearch(item || '')}
            />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={searchStyles({}).spinnerContainer}>
                <Spinner />
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
          keyboardShouldPersistTaps="handled"
        />
      ) : isLoading && videos.length === 0 ? (
        <View style={searchStyles({}).spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item: any) => item?._id || item?.youtubeId}
          renderItem={({ item }) => (
            <VideoItem
              videoData={item}
              onPress={() => {
                navigation.navigate('PlayVideoListScreen', {
                  videoDataProps: item,
                })
              }}
            />
          )}
          ListFooterComponent={
            isLoading && videos.length > 0 ? (
              <View style={searchStyles({}).activeIndicatorContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingTop: 12 }}
          keyboardShouldPersistTaps="handled"

        />
      )}


    </BackgroundWrapper>
  );
};

export default Search;
