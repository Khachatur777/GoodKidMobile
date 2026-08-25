import { NavigationProp } from '@react-navigation/native';
import { AlertModal, BackgroundWrapper, Button, KidAvatar, Spacing, Typography } from 'molecules';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { t } from 'i18next';
import Toast from 'react-native-toast-message';
import { AgeFilter, CategoriesFilter, LanguageFilter } from 'app-constants/shared.ts';
import {
  getActiveChildIdState,
  getChildrenState,
  isLoggedInSelector,
  setActiveChildId,
  setChildren,
  useEditChildFilterMutation,
  useGetChildrenQuery,
  useLazyGetChildFilterQuery,
  useGetVideosCountMutation,
} from 'rtk';
import { useDispatch, useSelector } from 'react-redux';
import { ChildSelector } from 'organisms';
import { ThemeContext } from 'theme';
import Badge from '../../molecules/badge/Badge.tsx';
import { filterStyles } from './filter-styles.ts';

export interface FilterProps {
  navigation: NavigationProp<any>;
}

interface IFilterData {
  id: number;
  name: string;
  key?: string;
  check?: boolean;
}

// The filter is configured per child. A parent does not filter their own feed
// here — the category chips on Home do that.
const Filter: FC<FilterProps> = ({ navigation }) => {
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => filterStyles(color), [color]);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(isLoggedInSelector);
  const children = useSelector(getChildrenState);
  const activeChildId = useSelector(getActiveChildIdState);

  const [language, setLanguage] = useState<string[]>([]);
  const [ages, setAges] = useState<number | null>(null);
  const [categories, setCategories] = useState<number[]>([]);
  const [dirty, setDirty] = useState(false);
  const [pendingChildId, setPendingChildId] = useState<string | null>(null);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  const { data: childrenResponse, isFetching: childrenLoading } = useGetChildrenQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !isLoggedIn,
  });

  const [loadChildFilter] = useLazyGetChildFilterQuery();
  const [editChildFilter] = useEditChildFilterMutation();
  const [getVideosCount] = useGetVideosCountMutation();

  useEffect(() => {
    if (childrenResponse?.data?.children) {
      dispatch(setChildren(childrenResponse.data.children));
    }
  }, [childrenResponse?.data?.children, dispatch]);

  const applyFilter = useCallback(
    async (childId: string) => {
      const response = await loadChildFilter({ id: childId });

      setCategories(response?.data?.filter?.categories || []);
      setAges(response?.data?.filter?.age ?? null);
      // Older filters hold a single language; the screen works in lists
      const saved = response?.data?.filter?.language;
      setLanguage(Array.isArray(saved) ? saved : saved ? [saved] : []);
      setDirty(false);
    },
    [loadChildFilter],
  );

  useEffect(() => {
    if (activeChildId) {
      applyFilter(activeChildId);
    }
  }, [activeChildId, applyFilter]);

  // Switching child with unsaved edits asks first
  const onSelectChild = useCallback(
    (childId: string) => {
      if (childId === activeChildId) return;

      if (dirty) {
        return setPendingChildId(childId);
      }

      dispatch(setActiveChildId(childId));
    },
    [activeChildId, dirty, dispatch],
  );

  const chooseFilterLanguage = useCallback((lng: IFilterData) => {
    const selectedKey = lng.key || lng.name;
    setLanguage(prev =>
      prev.includes(selectedKey) ? prev.filter(item => item !== selectedKey) : [...prev, selectedKey],
    );
    setDirty(true);
  }, []);

  const chooseFilterAge = useCallback((age: IFilterData) => {
    setAges(prev => (prev === age.id ? null : age.id));
    setDirty(true);
  }, []);

  const chooseFilter = useCallback((filter: IFilterData) => {
    setCategories(prev =>
      prev.includes(filter.id)
        ? prev.filter(item => item !== filter.id)
        : [...prev, filter.id],
    );
    setDirty(true);
  }, []);

  // Recounted while the parent taps: a filter that leaves three videos is worth
  // seeing before it is saved, not after.
  useEffect(() => {
    if (!activeChildId) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const response = await getVideosCount({
        categories,
        ...(ages ? {age: ages} : {}),
        ...(language.length ? {language} : {}),
      });

      if (!cancelled) setMatchCount(response?.data?.data?.count ?? null);
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeChildId, ages, categories, getVideosCount, language]);

  const onReset = useCallback(() => {
    setLanguage([]);
    setAges(null);
    setCategories([]);
    setDirty(true);
  }, []);

  const onSave = useCallback(async () => {
    if (!activeChildId) return;

    const response = await editChildFilter({
      id: activeChildId,
      categories,
      age: ages,
      language,
      showLoader: true,
      showModal: true,
    });

    if (response?.data?.success) {
      setDirty(false);

      setTimeout(() => {
        Toast.show({
          type: 'info',
          text1: t('filter_change_successfully_title'),
          text2: t('filter_change_successfully_description'),
          onPress: () => Toast.hide(),
        });
      }, 200);
    }
  }, [activeChildId, ages, categories, editChildFilter, language]);

  // The filter belongs to a child, so with no children there is nothing to set
  if (!childrenLoading && children.length === 0) {
    return (
      <BackgroundWrapper>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle}>
            <KidAvatar size={120} />
          </View>

          <Typography type="title3" alignment="center">
            {t('filter_no_children_title')}
          </Typography>

          <Typography type="bodyM" textColor="text_secondary" alignment="center">
            {t('filter_no_children_description')}
          </Typography>

          <View style={styles.emptyButton}>
            <Button
              title={t('children_add')}
              onPress={() =>
                navigation.navigate('ProfileTab', { screen: 'AddChildScreen' })
              }
            />
          </View>
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Typography type="bodyM" textColor="text_secondary">
          {t('filter_choose_child')}
        </Typography>

        <Spacing size={16} />

        <ChildSelector
          children={children}
          selectedId={activeChildId}
          onSelect={onSelectChild}
        />

        <View style={styles.section}>
          <Typography type="captionBold" textColor="text_secondary">
            {t('filter_items_title').toUpperCase()}
          </Typography>

          <View style={styles.filterItemsContainer}>
            {CategoriesFilter.map(filter => {
              const isSelected = categories.includes(filter.id);

              return (
                <Badge
                  key={filter.id}
                  title={t(filter.name)}
                  size="large"
                  onPress={() => chooseFilter(filter)}
                  borderWidth={0}
                  backgroundColor={isSelected ? 'accent_active' : 'surface_primary'}
                  badgeColor={isSelected ? 'text_inverted' : undefined}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Typography type="captionBold" textColor="text_secondary">
            {t('age').toUpperCase()}
          </Typography>

          <View style={styles.filterItemsContainer}>
            {AgeFilter.map(age => {
              const isSelected = ages === age.id;

              return (
                <Badge
                  key={age.id}
                  title={`${age.name} ${t('age')}`}
                  size="large"
                  onPress={() => chooseFilterAge(age)}
                  borderWidth={0}
                  backgroundColor={isSelected ? 'accent_active' : 'surface_primary'}
                  badgeColor={isSelected ? 'text_inverted' : undefined}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Typography type="captionBold" textColor="text_secondary">
            {t('language_title').toUpperCase()}
          </Typography>

          <View style={styles.filterItemsContainer}>
            {LanguageFilter.map(lng => {
              const isSelected = language.includes(lng.key || lng.name);

              return (
                <Badge
                  key={lng.id}
                  title={t(lng.name)}
                  size="large"
                  onPress={() => chooseFilterLanguage(lng)}
                  borderWidth={0}
                  backgroundColor={isSelected ? 'accent_active' : 'surface_primary'}
                  badgeColor={isSelected ? 'text_inverted' : undefined}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.stickyBottom}>
        {matchCount !== null && (
          <View style={styles.countRow}>
            <Typography type="bodySM" textColor="text_secondary">
              {t('filter_match_count', {count: matchCount})}
            </Typography>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.footerReset}>
            <Button variant="outline" title={t('filter_reset')} onPress={onReset} />
          </View>

          <View style={styles.footerSave}>
            <Button title={t('save')} onPress={onSave} />
          </View>
        </View>
      </View>

      <AlertModal
        isVisible={!!pendingChildId}
        setIsVisible={() => setPendingChildId(null)}
        title={t('filter_discard_title')}
        description={t('filter_discard_description')}
        buttons={[
          {
            title: t('filter_discard_btn'),
            variant: 'negative',
            onPress: () => {
              dispatch(setActiveChildId(pendingChildId));
              setPendingChildId(null);
            },
          },
          {
            title: t('cancel'),
            variant: 'secondary',
            onPress: () => setPendingChildId(null),
          },
        ]}
      />
    </BackgroundWrapper>
  );
};

export default Filter;
