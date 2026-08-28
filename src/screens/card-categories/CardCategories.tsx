import { FC, useCallback, useContext, useMemo } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { ICardCategory } from 'models';
import { useGetCardCategoriesQuery } from 'rtk';
import { getFileUri } from 'utils';
import { cardCategoriesStyles } from './card-categories-styles.ts';

export interface CardCategoriesProps {
  navigation: NavigationProp<any>;
}

const CardCategories: FC<CardCategoriesProps> = ({ navigation }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => cardCategoriesStyles(color), [color]);

  const { data, isLoading, isError, refetch } = useGetCardCategoriesQuery({
    section: 'world',
    showModal: false,
  });

  const categories = data?.data || [];

  const openCategory = useCallback(
    (category: ICardCategory) => {
      navigation.navigate('CardSession', { category });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: ICardCategory }) => (
      <Pressable
        style={[styles.item, !item.suitsAge && styles.itemAhead]}
        onPress={() => openCategory(item)}
      >
        <Image source={{ uri: getFileUri(item.image) }} style={styles.image} />

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
    ),
    [styles, t, openCategory],
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
          <Icon name={'CloudOffIcon'} width={56} height={56} color={'icon_tertiary'} />
          <Typography type="title3" alignment="center">{t('cards_offline_title')}</Typography>
          <Typography type="bodyS" textColor="text_tertiary" alignment="center">
            {t('cards_offline_hint')}
          </Typography>
          <Pressable style={styles.retry} onPress={() => refetch()}>
            <Typography type="bodyBold" textColor="text_inverted">{t('cards_retry')}</Typography>
          </Pressable>
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
