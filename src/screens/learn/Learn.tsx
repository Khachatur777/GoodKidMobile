import { FC, useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Typography } from 'molecules';
import { learnStyles } from './learn-styles.ts';
import { useTranslation } from 'react-i18next';
import {
  getContentLockedState,
  isLoggedInSelector,
  setSubscriptionUserData,
  useGetAllLearnCategoryQuery,
} from 'rtk';
import { ILearnCategoryItem } from 'models';
import { getFileUri } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { useContext } from 'react';
import { ThemeContext } from 'theme';
import { purchaseUser } from 'hooks/usePurchase.ts';

export interface LearnProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    {
      params: { extraData: string };
    },
    'params'
  >;
}

const Learn: FC<LearnProps> = ({ navigation }) => {
  const contentLocked = useSelector(getContentLockedState);
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => learnStyles(color), [color]);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const dispatch = useDispatch();

  const { data: learnCategory } = useGetAllLearnCategoryQuery(
    {
      showModal: true,
    },
    { skip: !isLoggedIn },
  );

  const purchase = useCallback(async () => {
    purchaseUser()
      .then(res => {

        dispatch(setSubscriptionUserData(res?.isSubscribed!));
      })
      .catch(e => {
        console.log(e, 'rrrr');
      });
  }, []);

  const _renderCategoriesItem = useCallback(
    ({ item, index }: { item: ILearnCategoryItem; index: number }) => {
      return (
        <Pressable
          style={styles.categoriesItemContainer}
          onPress={() => {
            if (contentLocked && index !== 0) {
              return purchase();
            }
            navigation.navigate('LearnExplanation', { category: item });
          }}
        >
          <Image
            source={{ uri: getFileUri(item.image) }}
            style={styles.image}
          />

          {contentLocked && index !== 0 ? (
            <>
              <View style={styles.overlay} />
              <Icon
                name={'Lock'}
                color={'text_secondary'}
                style={styles.lock_icon}
              />
            </>
          ) : null}

          <Typography
            type="bodyBold"
            textStyles={styles.cardTitle}
            style={contentLocked && index !== 0 && styles.blurredText}
          >
            {t(item.name)}
          </Typography>
        </Pressable>
      );
    },
    [contentLocked, styles, t],
  );

  return (
    <BackgroundWrapper containerStyles={{ paddingBottom: 80 }}>
      {isLoggedIn ? (
        learnCategory?.categories?.length ? (
          <>
          <Typography type="bodyM" textColor="text_secondary" textStyles={styles.subtitle}>
            {`${learnCategory.categories.length} ${t('learn_topics_label')} · ${t('learn_topics_hint')}`}
          </Typography>
          <FlatList
            contentContainerStyle={styles.flatListContainer}
            keyExtractor={item => `${item._id}`}
            data={learnCategory?.categories}
            renderItem={_renderCategoriesItem}
          />
          </>
        ) : null
      ) : null}
    </BackgroundWrapper>
  );
};

export default Learn;
