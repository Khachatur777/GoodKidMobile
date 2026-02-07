import {FC, useEffect} from 'react';
import {Image, Platform} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {
  getBuildNumber,
  getModel,
  getSystemVersion,
  getUniqueId,
  getVersion,
} from 'react-native-device-info';

import {BackgroundWrapper} from 'molecules';
import {LogoMin} from 'assets';
import {splashStyles} from './splash-styles.ts';
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
  useSignInUpGuestMutation,
} from 'rtk';
import {getItem, setItem} from 'configs';
import i18n from 'localization/localization.ts';
import {checkUserSubscription} from 'hooks/usePurchase.ts';

export interface SplashProps {
  navigation: NavigationProp<any>;
}

const Splash: FC<SplashProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const styles = splashStyles();

  const [authorization] = useAuthorizationMutation();
  const [filter] = useFilterMutation();
  const [fetchConfig] = useConfigMutation();
  const [signInUpGuestRequest] = useSignInUpGuestMutation();

  const productVersion = Platform.OS === 'android' ? getVersion() : getBuildNumber();

  const resetTo = (name: string) => {
    navigation.reset({index: 0, routes: [{name}]});
  };

  const getServerVersion = (cfg?: any) => {
    // поправь ключи под реальный контракт бэка:
    // например versionAppIos / versionAppAndroid
    if (!cfg) return '';
    return Platform.OS === 'ios'
      ? `${cfg.versionAppIos ?? cfg.versionApp ?? ''}`
      : `${cfg.versionAppAndroid ?? cfg.versionApp ?? ''}`;
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const safeGoTabsWithDelay = () => {
      timeoutId = setTimeout(() => resetTo('TabScreens'), 1500);
    };

    const ensureGuest = async () => {
      const guestId = await getItem('guestId');
      if (guestId) return;

      const deviceId = await getUniqueId();
      const dataGuest = {
        deviceId: deviceId!,
        deviceModel: getModel(),
        osVersion: getSystemVersion(),
        productVersion,
      };

      try {
        const response = await signInUpGuestRequest(dataGuest);
        if(response?.data?.success){
          await setItem('guestId', response?.data?.guest_id);
        }
      } catch (e) {
        console.warn('Guest signInUp failed:', e);
      }
    };

    const init = async () => {
      try {
        const [tokenData, language] = await Promise.all([
          getItem('tokenData'),
          getItem('language'),
        ]);

        await i18n.changeLanguage(language || 'en');

        await ensureGuest();

        if (!tokenData) {
          const responseConfig = await fetchConfig({});
          const cfg = responseConfig?.data?.data;

          const serverVersion = getServerVersion(cfg);

          if (
            responseConfig?.data?.success &&
            cfg?.update &&
            serverVersion &&
            `${productVersion}` !== `${serverVersion}`
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

        if (config?.forceUpdate && `${productVersion}` !== `${config?.versionApp}`) {
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
    signInUpGuestRequest,
  ]);

  return (
    <BackgroundWrapper containerStyles={styles.container}>
      <Image source={LogoMin} style={styles.logoMin} />
    </BackgroundWrapper>
  );
};

export default Splash;
