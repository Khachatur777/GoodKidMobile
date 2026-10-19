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
  // replace comes from the stack, the base type does not know about it: the
  // result screen and the end of a session replace the current screen rather
  // than pushing on top of it.
  navigation: NavigationProp<any> & {
    replace: (name: string, params?: object) => void;
  };
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

  // Never a "you lost". Even a zero result is an invitation to try again: for a
  // child of 4–6 losing is a reason to close the app.
  // A viewed category is not praised for "first try": nothing was answered
  // there, and the number would mean something other than its label.
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
              // Empty stars stay in place: the child sees how many more can be
              // earned, not only what was missed.
              color={starIndex < result.stars ? 'accent_active' : 'controls_inactive'}
            />
          ))}
        </View>

        {/* With its own ceiling: "10 of 10" solved sits next to it, and a bare
            five read as part of the same count. Each number has its own
            denominator, so there is nothing to mix up. */}
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
          {/* A finished view-only category gives no stars a second time, so
              there is no reason to make "again" the primary button. */}
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

          {/* The result replaces the session, so the screen underneath is the
              list the child came from: maths categories after a maths session,
              card categories after cards. Going back returns to it; navigating
              by name pushed a second maths list on top of this result, and its
              back button landed here again. */}
          <Pressable style={styles.secondary} onPress={() => navigation.goBack()}>
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
