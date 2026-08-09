import { FC, useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Typography } from 'molecules';
import { learnStyles } from './learn-styles.ts';
import { useTranslation } from 'react-i18next';
import {
  getSubscriptionUserState,
  getUserState,
  isLoggedInSelector,
  setSubscriptionUserData,
  useGetAllLearnCategoryQuery,
} from 'rtk';
import { ILearnCategoryItem } from 'models';
import { getFileUri } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { NoSignIn } from 'organisms';
import Toast from 'react-native-toast-message';
import { purchaseUser } from 'hooks/usePurchase.ts';
import { usePinAction } from 'hooks';

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
  const subscriptionState = useSelector(getSubscriptionUserState);
  const { t } = useTranslation();
  const styles = useMemo(() => learnStyles(), []);
  const isLoggedIn = useSelector(isLoggedInSelector);
  const { startPinAction } = usePinAction();
  const dispatch = useDispatch();
  const user = useSelector(getUserState);

  const { data: learnCategory } = useGetAllLearnCategoryQuery(
    {
      showModal: true,
    },
    { skip: !isLoggedIn },
  );

  const purchase = useCallback(async () => {
    const pinRes = await startPinAction();
    const pinCode = pinRes?.data;

    if (+pinCode !== user?.pinCode) {
      return setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: t('pin_code_incorrect_title'),
          text2: t('pin_code_incorrect_description'),
          onPress: () => Toast.hide(),
        });
      }, 200);
    }

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
            // if (!subscriptionState && index !== 0) {
            //   return purchase();
            // }
            navigation.navigate('LearnExplanation', { category: item });
          }}
        >
          <Image
            source={{ uri: getFileUri(item.image) }}
            style={styles.image}
          />

          {/*{!subscriptionState && index !== 0 ? (*/}
          {/*  <>*/}
          {/*    <View style={styles.overlay} />*/}
          {/*    <Icon*/}
          {/*      name={'Lock'}*/}
          {/*      color={'text_secondary'}*/}
          {/*      style={styles.lock_icon}*/}
          {/*    />*/}
          {/*  </>*/}
          {/*) : null}*/}

          <Typography
            style={!subscriptionState && index !== 0 && styles.blurredText}
          >
            {t(item.name)}
          </Typography>
        </Pressable>
      );
    },
    [],
  );

  return (
    <BackgroundWrapper containerStyles={{ paddingBottom: 80 }}>
      {isLoggedIn ? (
        learnCategory?.categories?.length ? (
          <FlatList
            contentContainerStyle={styles.flatListContainer}
            keyExtractor={item => `${item._id}`}
            data={learnCategory?.categories}
            renderItem={_renderCategoriesItem}
          />
        ) : null
      ) : (
        <NoSignIn typeDescription={'filter'} />
      )}
    </BackgroundWrapper>
  );
};

export default Learn;
