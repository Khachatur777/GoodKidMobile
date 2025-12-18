import {FC, useEffect} from 'react';
import {Image, Platform} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {getBuildNumber, getVersion} from 'react-native-device-info';

import {BackgroundWrapper} from 'molecules';
import {LogoMin} from 'assets';
import {splashStyles} from './splash-styles.ts';
import {
  setConfigData,
  setFilterData,
  setIsLoggedIn,
  setLanguageId,
  setSubscriptionUserData, setUpdateIsVisibleData,
  setUser,
  useAuthorizationMutation, useConfigMutation,
  useFilterMutation,
} from 'rtk';
import {getItem} from 'configs';
import i18n from 'localization/localization.ts';
import {checkUserSubscription} from 'hooks/usePurchase.ts';
import Purchases from 'react-native-purchases';

export interface SplashProps {
  navigation: NavigationProp<any>;
}

const Splash: FC<SplashProps> = ({navigation}) => {
  const [authorization] = useAuthorizationMutation();
  const [filter] = useFilterMutation();
  const [configData] = useConfigMutation();
  const dispatch = useDispatch();
  const styles = splashStyles();

  const versionNumber =
    Platform.OS === 'android' ? getVersion() : getBuildNumber();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const navigateToTabs = () => {
      navigation.reset({
        index: 0,
        routes: [{name: 'TabScreens'}],
      });
    };

    const navigateToForceUpdate = () => {
      navigation.reset({
        index: 0,
        routes: [{name: 'ForceUpdateScreen'}],
      });
    };

    const init = async () => {
      try {
        const tokenData = await getItem('tokenData');
        const language = await getItem('language');

        await i18n.changeLanguage(language || 'en');

        if (!tokenData) {
          const responseConfig = await configData({})

          if (responseConfig?.data?.success && responseConfig?.data?.data?.update && `${versionNumber}` !== `${responseConfig?.data?.data?.versionApp}`) {
            dispatch(setUpdateIsVisibleData(true));
          }

          timeoutId = setTimeout(navigateToTabs, 1500);
          return;
        }

        const response = await authorization({});

        if (!response?.data?.success) {
          timeoutId = setTimeout(navigateToTabs, 1500);
          return;
        }

        const {user, config} = response.data;

        // Проверка на форс-апдейт
        if (config?.forceUpdate && `${versionNumber}` !== `${config?.versionApp}`) {
          navigateToForceUpdate();
          return;
        }

        try {
          await Purchases.logIn(user?.id?.toString());

          await Purchases.setAttributes({
            'E-mail': user?.email,
            Name: `${user?.profile?.firstName} ${user?.profile?.lastName}`,
            VersionNumber: versionNumber,
            LoginTime: new Date().toString(),
          });

          const userSubscription = await checkUserSubscription();
          dispatch(setSubscriptionUserData(userSubscription.isSubscribed));
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

        navigateToTabs();
      } catch (e) {
        console.error('Splash init error:', e);
        timeoutId = setTimeout(navigateToTabs, 1500);
      }
    };

    init();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [authorization, dispatch, filter, navigation, versionNumber]);

  return (
    <BackgroundWrapper containerStyles={styles.container}>
      <Image source={LogoMin} style={styles.logoMin} />
    </BackgroundWrapper>
  );
};

export default Splash;
