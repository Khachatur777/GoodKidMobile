import { FC, useCallback, useMemo } from 'react';
import { FlatList, Image, Pressable } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Typography } from 'molecules';
import { learnStyles } from './learn-styles.ts';
import { useTranslation } from 'react-i18next';
import { useGetAllLearnCategoryQuery } from 'rtk';
import { ILearnCategoryItem } from 'models';
import { getFileUri } from 'utils';

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
  const { t } = useTranslation();
  const styles = useMemo(() => learnStyles(), []);

  const { data: learnCategory } = useGetAllLearnCategoryQuery({
    showLoader: true,
    showModal: true,
  });

  const _renderCategoriesItem = useCallback(
    ({ item }: { item: ILearnCategoryItem }) => {
      return (
        <Pressable
          style={styles.categoriesItemContainer}
          onPress={() =>
            navigation.navigate('LearnExplanation', { category: item })
          }
        >
          <Image
            source={{ uri: getFileUri(item.image) }}
            style={styles.image}
          />

          <Typography>{t(item.name)}</Typography>
        </Pressable>
      );
    },
    [],
  );

  return (
    <BackgroundWrapper containerStyles={{ paddingBottom: 80 }}>
      {learnCategory?.categories?.length ? (
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          keyExtractor={item => `${item._id}`}
          data={learnCategory?.categories}
          renderItem={_renderCategoriesItem}
        />
      ) : null}
    </BackgroundWrapper>
  );
};

export default Learn;
