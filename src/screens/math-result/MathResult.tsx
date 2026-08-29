import { FC, useContext, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { IMathCategory, ISessionResult } from 'models';
import { mathResultStyles } from './math-result-styles.ts';

const MAX_STARS = 5;

export interface MathResultProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    { params: { result: ISessionResult; category: IMathCategory } },
    'params'
  >;
}

const MathResult: FC<MathResultProps> = ({ navigation, route }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => mathResultStyles(color), [color]);

  const { result, category } = route.params;

  // Ни одного «ты проиграл». Даже нулевой результат — приглашение попробовать
  // ещё раз: у ребёнка 4–6 лет проигрыш это причина закрыть приложение.
  // Просмотренную категорию не хвалят за «первую попытку»: там ничего не
  // отвечали, и цифра означала бы не то, что написано рядом.
  const message = result.viewOnly
    ? result.stars > 0
      ? t('cards_done_reward', { count: result.totalQuestions })
      : t('cards_done_again')
    : result.perfect
    ? t('math_result_perfect', { total: result.totalQuestions })
    : result.correctFirstTry > 0
      ? t('math_result_good', { count: result.correctFirstTry })
      : t('math_result_try_again');

  return (
    <BackgroundWrapper includesSafeArea>
      <View style={styles.container}>
        <View style={styles.badge}>
          <Icon
            name={result.perfect ? 'SparklesIcon' : 'StarIcon'}
            width={48}
            height={48}
            color={'accent_active'}
          />
        </View>

        {result.perfect && (
          <Typography type="titleL" textStyles={styles.title}>
            {t('math_result_perfect_title')}
          </Typography>
        )}

        <View style={styles.stars}>
          {Array.from({ length: MAX_STARS }).map((_, starIndex) => (
            <Icon
              key={starIndex}
              name={'StarIcon'}
              width={38}
              height={38}
              // Пустые звёзды остаются на месте: ребёнок видит, сколько ещё
              // можно получить, а не только то, что не получил.
              color={starIndex < result.stars ? 'accent_active' : 'controls_inactive'}
            />
          ))}
        </View>

        {/* Со своим потолком: рядом стоит «10 из 10» решённых, и голая пятёрка
            читалась как продолжение того же счёта. У каждого числа свой
            знаменатель — спутать нечего. */}
        <Typography type="titleL" textStyles={styles.starsCount}>
          {t('math_result_stars_of', { count: result.stars, max: MAX_STARS })}
        </Typography>

        <Typography type="body" textColor="text_tertiary" textStyles={styles.message}>
          {message}
        </Typography>

        <View style={styles.statCard}>
          <View style={styles.statRow}>
            <Typography type="bodyS" textColor="text_tertiary">
              {result.viewOnly ? t('cards_result_viewed') : t('math_result_first_try')}
            </Typography>
            <Typography type="bodyBold">
              {t('math_result_of', {
                correct: result.correctFirstTry,
                total: result.totalQuestions,
              })}
            </Typography>
          </View>

          {result.totalStars !== null && (
            <View style={styles.statRow}>
              <Typography type="bodyS" textColor="text_tertiary">
                {t('math_result_total_stars')}
              </Typography>
              <View style={styles.statValue}>
                <Icon name={'StarIcon'} width={20} height={20} color={'accent_active'} />
                <Typography type="bodyBold">{String(result.totalStars)}</Typography>
              </View>
            </View>
          )}
        </View>

        <View style={styles.buttons}>
          {/* Пройденная просмотровая категория повторно звёзд не даёт, поэтому
              и звать «ещё раз» первой кнопкой незачем. */}
          <Pressable
            style={result.viewOnly ? styles.secondary : styles.primary}
            onPress={() =>
              category
                ? navigation.replace('MathCard', { category })
                : navigation.goBack()
            }
          >
            <Typography type="titleL" textColor="text_inverted" textStyles={styles.buttonText}>
              {t('math_result_again')}
            </Typography>
          </Pressable>

          <Pressable style={styles.secondary} onPress={() => navigation.navigate('MathCategories')}>
            <Typography type="titleL" textStyles={styles.buttonText}>
              {t('math_result_to_categories')}
            </Typography>
          </Pressable>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default MathResult;
