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
  setFilterData,
  setIsLoggedIn,
  setLanguageId,
  setSubscriptionUserData,
  setUpdateIsVisibleData,
  setUser,
  useAuthorizationMutation,
  useConfigMutation,
  useFilterMutation,
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
  const [filter] = useFilterMutation();
  const [fetchConfig] = useConfigMutation();

  const productVersion = getBuildNumber();

  const resetTo = (name: string) => {
    navigation.reset({index: 0, routes: [{name}]});
  };


  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const safeGoTabsWithDelay = () => {
      timeoutId = setTimeout(() => resetTo('TabScreens'), 1500);
    };

    const init = async () => {
      try {
        const [tokenData, language] = await Promise.all([
          getItem('tokenData'),
          getItem('language'),
        ]);

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

          safeGoTabsWithDelay();
          return;
        }

        const response = await authorization({});

        if (!response?.data?.success) {
          safeGoTabsWithDelay();
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
        dispatch(setLanguageId(user?.profile?.preferredLanguages));
        dispatch(setConfigData(config));

        const responseFilter = await filter({});
        if (responseFilter?.data?.success) {
          dispatch(setFilterData(responseFilter.data.filter));
        }

        resetTo('TabScreens');
      } catch (e) {
        console.error('Splash init error:', e);
        safeGoTabsWithDelay();
      }
    };

    init();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    authorization,
    dispatch,
    filter,
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
