import {FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, Pressable, TextInput, View} from 'react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {BackgroundWrapper, Icon, Spinner} from 'molecules';
import {searchStyles} from './search-styles.ts';
import {t} from 'i18next';
import {ThemeContext} from 'theme';
import {useGetAllHomeVideosMutation, useGetSearchTitleVideosMutation,} from 'rtk';
import {VideoRow} from 'organisms';
import {CategoriesFilter} from 'app-constants/shared.ts';
import {formatTime} from 'utils';
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
  const [suggestions, setSuggestions] = useState<{
    title: string,
    thumbnail: string,
  }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceRef = useRef<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const styles = searchStyles({color});

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
    } catch {
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [getVideos, searchText]);

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
      } catch {
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
    <BackgroundWrapper backgroundColor="bg_primary" includesSafeArea>
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="ChevronLeft" color="icon_secondary" />
        </Pressable>

        <View style={styles.searchFieldContainer}>
          <Icon name="SearchLgIcon" color="text_tertiary" width={20} height={20} />

          <TextInput
            value={searchText}
            onChangeText={e => {
              setSearchText(e);
              setShowResults(false);
            }}
            placeholder={t('search_placeholder')}
            placeholderTextColor={color?.('text_tertiary')}
            style={styles.searchInput}
            returnKeyType={'search'}
            autoFocus
            onSubmitEditing={() => submitSearch()}
          />
        </View>
      </View>

      {!showResults ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item: any) => `${item?.title} ${item?.thumbnail}`}
          renderItem={({ item }) => (
            <VideoRow
              title={item?.title}
              thumbnail={item?.thumbnail}
              onPress={() => submitSearch(item?.title || '')}
            />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View style={styles.spinnerContainer}>
                <Spinner />
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      ) : isLoading && videos.length === 0 ? (
        <View style={styles.spinnerContainer}>
          <Spinner />
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item: any) => item?._id || item?.youtubeId}
          renderItem={({ item }) => {
            const category = CategoriesFilter.find(c => c.id === item?.categoryIds?.[0]);
            const meta = [category ? t(category.name) : null, formatTime(item?.duration)]
              .filter(Boolean)
              .join(' · ');

            return (
              <VideoRow
                title={item?.title}
                thumbnail={item?.thumbnail}
                meta={meta}
                onPress={() => {
                  navigation.navigate('PlayVideoListScreen', {
                    videoDataProps: item,
                  })
                }}
              />
            );
          }}
          ListFooterComponent={
            isLoading && videos.length > 0 ? (
              <View style={styles.activeIndicatorContainer}>
                <ActivityIndicator size="small" color={color?.('accent_active')} />
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </BackgroundWrapper>
  );
};

export default Search;
