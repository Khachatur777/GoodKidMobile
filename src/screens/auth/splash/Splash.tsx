import { FC, useEffect } from 'react';
import { Image, Platform } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import {
  getBuildNumber,
  getModel,
  getSystemVersion,
  getUniqueId,
} from 'react-native-device-info';

import { BackgroundWrapper, GoodKidLogo } from 'molecules';

import { splashStyles } from './splash-styles.ts';
import {
  setConfigData,
  setOnboardingSeen,
  setIsLoggedIn,
  setLanguageId,
  setSubscriptionUserData,
  setUpdateIsVisibleData,
  setUser,
  useAuthorizationMutation,
  useConfigMutation,
} from 'rtk';
import { getItem, setItem } from 'configs';
import i18n from 'localization/localization.ts';
import { checkUserSubscription } from 'hooks/usePurchase.ts';

export interface SplashProps {
  navigation: NavigationProp<any>;
}

const Splash: FC<SplashProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const styles = splashStyles();

  const [authorization] = useAuthorizationMutation();
  const [fetchConfig] = useConfigMutation();

  const productVersion = getBuildNumber();

  const resetTo = (name: string, params?: object) => {
    navigation.reset({index: 0, routes: [{name, params}]});
  };

  // Splash живёт внутри auth-стека, поэтому переход на его же экраны делаем
  // напрямую, а не через корневой сброс.
  const resetToAuthScreen = (screen: string) => {
    navigation.reset({index: 0, routes: [{name: screen}]});
  };


  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // Гостевого режима больше нет: без аккаунта роли неизвестны, а значит
    // неизвестно и что показывать — поэтому всегда на вход.
    const safeGoSignInWithDelay = (seenOnboarding: boolean) => {
      const screen = seenOnboarding ? 'SignIn' : 'Onboarding';

      timeoutId = setTimeout(() => resetToAuthScreen(screen), 1500);
    };

    const init = async () => {
      try {
        const [tokenData, language, onboardingSeen] = await Promise.all([
          getItem('tokenData'),
          getItem('language'),
          getItem('onboardingSeen'),
        ]);

        dispatch(setOnboardingSeen(!!onboardingSeen));

        await i18n.changeLanguage(language || 'en');


        if (!tokenData) {
          const responseConfig = await fetchConfig({});
          const cfg = responseConfig?.data?.data;

          if (responseConfig?.data?.success && cfg) {
            dispatch(setConfigData(cfg));
          }

          if (
            responseConfig?.data?.success &&
            cfg?.update &&
            `${productVersion}` !==
              `${
                Platform.OS === 'android'
                  ? cfg?.versionAppAndroid
                  : cfg?.versionAppIos
              }`
          ) {
            dispatch(setUpdateIsVisibleData(true));
          }

          safeGoSignInWithDelay(!!onboardingSeen);
          return;
        }

        const response = await authorization({});

        if (!response?.data?.success) {
          safeGoSignInWithDelay(!!onboardingSeen);
          return;
        }

        const {user, config} = response.data;

        if (
          config?.forceUpdate &&
          `${productVersion}` !==
            `${
              Platform.OS === 'android'
                ? config?.versionAppAndroid
                : config?.versionAppIos
            }`
        ) {
          resetTo('ForceUpdateScreen');
          return;
        }

        try {
          const userSubscription = await checkUserSubscription();
          dispatch(setSubscriptionUserData(!!userSubscription?.isSubscribed));
        } catch (e) {
          console.warn('RevenueCat error:', e);
        }

        dispatch(setIsLoggedIn(true));
        dispatch(setUser(user));
        dispatch(setLanguageId(user?.role === 'child' ? user?.language : user?.profile?.preferredLanguages));
        dispatch(setConfigData(config));

        resetTo('TabScreens');
      } catch (e) {
        console.error('Splash init error:', e);
        safeGoSignInWithDelay(!!onboardingSeen);
      }
    };

    init();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    authorization,
    dispatch,
    fetchConfig,
    navigation,
    productVersion,
  ]);

  return (
    <BackgroundWrapper containerStyles={styles.container}>
      <GoodKidLogo size={96} variant="stacked" />
    </BackgroundWrapper>
  );
};

export default Splash;
