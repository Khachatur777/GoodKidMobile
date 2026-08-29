import { FC, useCallback, useContext, useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IMathCategory, MathOperation } from 'models';
import { getIsChildState, useGetMathCategoriesQuery } from 'rtk';
import { mathCategoriesStyles } from './math-categories-styles.ts';

const OPERATION_SIGNS: Record<MathOperation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

export interface MathCategoriesProps {
  navigation: NavigationProp<any>;
}

const MathCategories: FC<MathCategoriesProps> = ({ navigation }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => mathCategoriesStyles(color), [color]);

  const isChild = useSelector(getIsChildState);
  const { data, isLoading } = useGetMathCategoriesQuery({ showModal: true });

  const categories = data?.data || [];
  // Сервер уже отдаёт подходящие возрасту первыми; здесь только разделение на
  // две группы с разными заголовками.
  const forNow = categories.filter(item => item.suitsAge);
  const ahead = categories.filter(item => !item.suitsAge);

  const totalStars = categories.reduce((sum, item) => sum + item.starsEarned, 0);

  const openCategory = useCallback(
    (category: IMathCategory) => {
      navigation.navigate('MathCard', { category });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: IMathCategory }) => (
      <Pressable
        style={[styles.item, !item.suitsAge && styles.itemAhead]}
        onPress={() => openCategory(item)}
      >
        <View style={[styles.sign, !item.suitsAge && styles.signAhead]}>
          <Typography
            type="titleXL"
            textColor={item.suitsAge ? 'accent_active' : 'text_tertiary'}
            textStyles={styles.signText}
          >
            {OPERATION_SIGNS[item.operation]}
          </Typography>
        </View>

        <View style={styles.itemText}>
          <Typography type="title3">{t(`math_${item.operation}`)}</Typography>
          <Typography type="bodyS" textColor="text_tertiary">
            {item.suitsAge
              ? t('math_up_to', { value: item.maxResult })
              : t('math_for_later')}
          </Typography>
        </View>

        {isChild && item.starsEarned > 0 && (
          <View style={styles.starsBadge}>
            <Icon name={'StarIcon'} width={18} height={18} color={'accent_active'} />
            <Typography type="bodySBold">{String(item.starsEarned)}</Typography>
          </View>
        )}
      </Pressable>
    ),
    [styles, t, openCategory, isChild],
  );

  const renderGroup = (title: string, items: IMathCategory[]) =>
    items.length > 0 ? (
      <>
        <Typography
          type="bodySBold"
          textColor="text_tertiary"
          textStyles={styles.groupTitle}
        >
          {title}
        </Typography>
        {items.map(item => (
          <View key={item.categoryKey}>{renderItem({ item })}</View>
        ))}
      </>
    ) : null;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        {isLoading ? (
          <Loader />
        ) : (
          <FlatList
            data={[0]}
            keyExtractor={() => 'math-groups'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={() => (
              <>
                {isChild && (
                  <View style={styles.starsBadge}>
                    <Icon name={'StarIcon'} width={20} height={20} color={'accent_active'} />
                    <Typography type="bodyBold">{String(totalStars)}</Typography>
                  </View>
                )}

                {renderGroup(t('math_for_you_now'), forNow)}
                {renderGroup(t('math_try_when_ready'), ahead)}
              </>
            )}
          />
        )}
      </View>
    </BackgroundWrapper>
  );
};

export default MathCategories;
