import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Button, Icon, Spacing, Typography } from 'molecules';
import { FC, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setItem } from 'configs';
import { setOnboardingSeen } from 'rtk';
import { ThemeContext } from 'theme';
import { IIcons } from 'assets';
import { onboardingStyles } from './onboarding-styles';

export interface OnboardingProps {
  navigation: NavigationProp<any>;
}

interface ISlide {
  key: string;
  icon: IIcons;
  tintLight: string;
  tintDark: string;
}

// Четыре слайда из макета. Иллюстрации пока собраны из иконок приложения на
// тонированной подложке — настоящие персонажи ещё не нарисованы.
const SLIDES: ISlide[] = [
  {key: 'onboarding_1', icon: 'Sliders04Icon', tintLight: '#EDE9FD', tintDark: '#2A2350'},
  {key: 'onboarding_2', icon: 'User02Icon', tintLight: '#FFF1CE', tintDark: '#3A2F16'},
  {key: 'onboarding_3', icon: 'PuzzleIcon', tintLight: '#D8F1E8', tintDark: '#16332B'},
  {key: 'onboarding_4', icon: 'LineChartUp03Icon', tintLight: '#DCE9FF', tintDark: '#14294D'},
];

const Onboarding: FC<OnboardingProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { color, theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const styles = useMemo(() => onboardingStyles(color, width), [color, width]);
  const dispatch = useDispatch();
  const listRef = useRef<FlatList<ISlide>>(null);

  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  // Онбординг показывается один раз на устройство
  const finish = useCallback(async () => {
    dispatch(setOnboardingSeen(true));
    await setItem('onboardingSeen', true);

    navigation.reset({index: 0, routes: [{name: 'SignIn'}]});
  }, [dispatch, navigation]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / width);

      if (next !== index) setIndex(next);
    },
    [index, width],
  );

  return (
    <BackgroundWrapper includesSafeArea>
      <View style={styles.container}>
        <View style={styles.skipRow}>
          {/* На последнем слайде вместо Skip уже стоят кнопки внизу */}
          {isLast ? null : (
            <Pressable onPress={finish}>
              <Typography type="bodyMBold" textColor="text_secondary">
                {t('onboarding_skip')}
              </Typography>
            </Pressable>
          )}
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View
                style={[
                  styles.illustration,
                  {backgroundColor: theme === 'dark' ? item.tintDark : item.tintLight},
                ]}
              >
                <Icon name={item.icon} width={120} height={120} color="accent_active" />
              </View>

              <View style={styles.texts}>
                <Typography type="titleL" alignment="center">
                  {t(`${item.key}_title`)}
                </Typography>

                <Typography type="bodyM" textColor="text_secondary" alignment="center">
                  {t(`${item.key}_description`)}
                </Typography>
              </View>
            </View>
          )}
        />

        <View style={styles.footer}>
          {isLast ? (
            <>
              <Button title={t('onboarding_get_started')} onPress={finish} />

              <Spacing size={4} />

              <Button
                variant="ghost"
                title={t('onboarding_have_account')}
                onPress={finish}
              />
            </>
          ) : (
            <View style={styles.dots}>
              {SLIDES.map((slide, slideIndex) => (
                <View
                  key={slide.key}
                  style={[styles.dot, slideIndex === index ? styles.dotActive : null]}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default Onboarding;
