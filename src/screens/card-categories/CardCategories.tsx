import { FC, useCallback, useContext, useMemo } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ICardCategory } from 'models';
import {
  getContentLockedState,
  setSubscriptionUserData,
  useGetCardCategoriesQuery,
} from 'rtk';
import { purchaseUser } from 'hooks/usePurchase.ts';
import { getFileUri } from 'utils';
import { cardCategoriesStyles } from './card-categories-styles.ts';

export interface CardCategoriesProps {
  navigation: NavigationProp<any>;
}

const CardCategories: FC<CardCategoriesProps> = ({ navigation }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => cardCategoriesStyles(color), [color]);

  const dispatch = useDispatch();
  // Платность приходит с сервера полем isFree, а сам замок зависит от подписки
  // семьи. Оба условия должны совпасть: бесплатную категорию не запирает даже
  // отсутствие подписки.
  const contentLocked = useSelector(getContentLockedState);

  const { data, isLoading, isError, error, refetch } = useGetCardCategoriesQuery({
    section: 'world',
    showModal: false,
  });

  // Отказ по правам — не обрыв связи. Предлагать «проверь соединение» тому, у
  // кого связь в порядке, значит отправить его чинить исправное.
  const forbidden =
    (error as { status?: number })?.status === 403 ||
    (error as { data?: { message?: string } })?.data?.message === 'child_only';

  const categories = data?.data || [];

  const purchase = useCallback(() => {
    purchaseUser()
      .then(result => dispatch(setSubscriptionUserData(result?.isSubscribed!)))
      .catch(() => null);
  }, [dispatch]);

  const openCategory = useCallback(
    (category: ICardCategory) => {
      if (contentLocked && !category.isFree) {
        return purchase();
      }
      navigation.navigate('CardSession', { category });
    },
    [navigation, contentLocked, purchase],
  );

  const renderItem = useCallback(
    ({ item }: { item: ICardCategory }) => {
      const locked = contentLocked && !item.isFree;

      return (
      <Pressable
        style={[styles.item, !item.suitsAge && styles.itemAhead]}
        onPress={() => openCategory(item)}
      >
        <Image source={{ uri: getFileUri(item.image) }} style={styles.image} />

        {locked && (
          <>
            <View style={styles.lockOverlay} />
            <Icon name={'Lock'} width={26} height={26} color={'icon_inverted'} style={styles.lockIcon} />
          </>
        )}

        <View style={styles.itemBody}>
          <Typography type="bodyBold" numberOfLines={2}>
            {t(item.name)}
          </Typography>

          <View style={styles.lockRow}>
            {item.starsEarned > 0 ? (
              <View style={styles.starsRow}>
                <Icon name={'StarIcon'} width={15} height={15} color={'accent_active'} />
                <Typography type="captionBold" textColor="text_tertiary">
                  {String(item.starsEarned)}
                </Typography>
              </View>
            ) : (
              <Typography type="caption" textColor="text_tertiary">
                {t('cards_count', { count: item.cardsTotal })}
              </Typography>
            )}
          </View>
        </View>
      </Pressable>
      );
    },
    [styles, t, openCategory, contentLocked],
  );

  if (isLoading) {
    return (
      <BackgroundWrapper>
        <Loader />
      </BackgroundWrapper>
    );
  }

  if (isError) {
    return (
      <BackgroundWrapper>
        <View style={styles.stateBox}>
          <Icon
            name={forbidden ? 'Lock' : 'CloudOffIcon'}
            width={56}
            height={56}
            color={'icon_tertiary'}
          />
          <Typography type="title3" alignment="center">
            {forbidden ? t('learning_child_only_title') : t('cards_offline_title')}
          </Typography>
          <Typography type="bodyS" textColor="text_tertiary" alignment="center">
            {forbidden ? t('learning_child_only') : t('cards_offline_hint')}
          </Typography>

          {!forbidden && (
            <Pressable style={styles.retry} onPress={() => refetch()}>
              <Typography type="bodyBold" textColor="text_inverted">{t('cards_retry')}</Typography>
            </Pressable>
          )}
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={item => item.categoryKey}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      </View>
    </BackgroundWrapper>
  );
};

export default CardCategories;
