import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Loader, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ICardCategory, IMathCategory, MathOperation } from 'models';
import {
  getIsChildState,
  getUserState,
  useGetCardCategoriesQuery,
  useGetLearningProgressQuery,
  useGetMathCategoriesQuery,
} from 'rtk';
import { mathCategoriesStyles } from './math-categories-styles.ts';

const OPERATION_SIGNS: Record<MathOperation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

// Одна плитка описывает и бесконечный генератор арифметики, и обычную категорию
// карточек: на экране они стоят вперемешку, и различать их ребёнку незачем.
interface Tile {
  key: string;
  sign: string;
  name: string;
  // Бесконечные примеры вместо «сколько пройдено»: у генератора нет дна.
  endless: boolean;
  progress: string | null;
  ageFrom: number;
  ageTo: number;
  onPress: () => void;
}

export interface MathCategoriesProps {
  navigation: NavigationProp<any>;
}

const MathCategories: FC<MathCategoriesProps> = ({ navigation }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => mathCategoriesStyles(color), [color]);

  const isChild = useSelector(getIsChildState);
  const user = useSelector(getUserState);

  const { data, isLoading } = useGetMathCategoriesQuery({ showModal: true });

  // Карточные категории раздела «математика» стоят в той же сетке, что и
  // арифметика: для ребёнка это один раздел, а не два источника.
  const { data: cards } = useGetCardCategoriesQuery({ section: 'math' });

  // Общий счёт ребёнка, тот же, что на разделах и в профиле. Складывать здесь
  // только математические категории значило бы показывать в том же углу той же
  // звёздочкой другое число — и не сказать, чем оно отличается.
  const { data: progress } = useGetLearningProgressQuery(
    { showModal: false },
    { skip: !isChild },
  );

  const totalStars = progress?.data?.stars?.total ?? 0;

  // Счёт стоит в одной строке с заголовком, а рисует шапку общий компонент —
  // поэтому плашка уезжает туда, а не занимает отдельную строку под ним.
  useEffect(() => {
    if (!isChild) return;

    navigation.setOptions({
      renderRightSection: () => (
        <View style={styles.starPill}>
          <Icon name="StarIcon" width={17} height={17} color="accent_star" />
          <Typography type="bodySBold" textColor="text_star">
            {String(totalStars)}
          </Typography>
        </View>
      ),
    });
  }, [isChild, navigation, styles, totalStars]);

  const tiles = useMemo<Tile[]>(() => {
    const math: Tile[] = (data?.data || []).map((item: IMathCategory) => ({
      key: item.categoryKey,
      sign: OPERATION_SIGNS[item.operation],
      name: t(`math_${item.operation}`),
      endless: true,
      progress: null,
      ageFrom: item.ageFrom,
      ageTo: item.ageTo,
      onPress: () => navigation.navigate('MathCard', { category: item }),
    }));

    const answeredByKey = new Map(
      (progress?.data?.categories || []).map(row => [row.categoryKey, row.answered]),
    );

    const cardTiles: Tile[] = (cards?.data || []).map((item: ICardCategory) => ({
      key: item.categoryKey,
      sign: item.image || '#',
      name: item.name,
      endless: false,
      progress: item.cardsTotal
        ? t('math_cards_progress', {
            done: answeredByKey.get(item.categoryKey) ?? 0,
            total: item.cardsTotal,
          })
        : null,
      ageFrom: item.ageFrom,
      ageTo: item.ageTo,
      onPress: () => navigation.navigate('CardSession', { category: item }),
    }));

    return [...math, ...cardTiles];
  }, [cards, data, navigation, progress, t]);

  // Три группы, а не две: «не по возрасту» значит и «перерос», и «ещё рано», и
  // ребёнку это совершенно разные вещи. Каждая показывается, только если в ней
  // что-то есть.
  const age = typeof user?.age === 'number' ? user.age : null;
  const outgrown = age === null ? [] : tiles.filter(tile => tile.ageTo < age);
  const ahead = age === null ? [] : tiles.filter(tile => tile.ageFrom > age);
  const current = tiles.filter(
    tile => !outgrown.includes(tile) && !ahead.includes(tile),
  );

  const renderTile = useCallback(
    (tile: Tile, muted?: boolean) => (
      <Pressable
        key={tile.key}
        style={[styles.tile, muted && styles.tileMuted]}
        onPress={tile.onPress}
      >
        <Text
          style={[
            styles.sign,
            muted && styles.signMuted,
            tile.sign.length > 1 && styles.signSmall,
          ]}
        >
          {tile.sign}
        </Text>

        <View style={styles.tileBottom}>
          <View style={styles.nameRow}>
            <Typography
              type="bodySBold"
              textColor={muted ? 'text_secondary' : 'text_primary'}
              numberOfLines={2}
            >
              {tile.name}
            </Typography>

            {tile.endless && !muted && <Text style={styles.infinity}>∞</Text>}
          </View>

          {!!tile.progress && (
            <Typography type="caption" textColor="text_tertiary">
              {tile.progress}
            </Typography>
          )}
        </View>
      </Pressable>
    ),
    [styles],
  );

  const group = (title: string, items: Tile[], muted?: boolean) =>
    items.length > 0 && (
      <>
        <View style={styles.groupTitle}>
          <Typography type="captionBold" textColor="text_secondary">
            {title.toUpperCase()}
          </Typography>
        </View>

        <View style={styles.grid}>{items.map(tile => renderTile(tile, muted))}</View>
      </>
    );

  if (isLoading) {
    return (
      <BackgroundWrapper>
        <View style={styles.loader}>
          <Loader isLoading />
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {group(t('math_for_you_now'), current)}
          {group(t('math_try_when_ready'), ahead)}
          {group(t('math_already_know'), outgrown, true)}

          {tiles.some(tile => tile.endless) && (
            <View style={styles.note}>
              <Text style={styles.infinity}>∞</Text>
              <View style={styles.noteText}>
                <Typography type="bodyS" textColor="text_secondary">
                  {t('math_endless_note')}
                </Typography>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
};

export default MathCategories;
