import { FC, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import {
  getBuildNumber,
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
import { getItem } from 'configs';
import { isForceUpdateRequired, isOptionalUpdateAvailable } from 'helpers';
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

  // Splash lives inside the auth stack, so moving to its sibling screens is done
  // directly rather than through a root reset.
  const resetToAuthScreen = (screen: string) => {
    navigation.reset({index: 0, routes: [{name: screen}]});
  };


  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // There is no guest mode any more: without an account the role is unknown, and
    // so is what to show — hence always to sign-in.
    const safeGoSignInWithDelay = (seenOnboarding: boolean) => {
      const screen = seenOnboarding ? 'SignIn' : 'Onboarding';

      timeoutId = setTimeout(() => resetToAuthScreen(screen), 1500);
    };

    const init = async () => {
      // Read outside the try: a const declared inside it is invisible to the
      // catch below, and the failure path needs to know whether the onboarding
      // has already been seen. Reaching for it there threw instead of
      // navigating, and the app sat on the splash screen for good.
      let onboardingSeen = false;

      try {
        const [tokenData, language, seenOnboarding] = await Promise.all([
          getItem('tokenData'),
          getItem('language'),
          getItem('onboardingSeen'),
        ]);

        onboardingSeen = !!seenOnboarding;

        dispatch(setOnboardingSeen(onboardingSeen));

        await i18n.changeLanguage(language || 'en');


        if (!tokenData) {
          const responseConfig = await fetchConfig({});
          const cfg = responseConfig?.data?.data;

          if (responseConfig?.data?.success && cfg) {
            dispatch(setConfigData(cfg));
          }

          // A blocked version is blocked whether or not anyone is signed in.
          // This used to be checked only after a successful authorization, so a
          // signed-out person walked past the gate into a version we had pulled.
          if (isForceUpdateRequired(Number(productVersion), cfg)) {
            resetTo('ForceUpdateScreen');
            return;
          }

          if (isOptionalUpdateAvailable(Number(productVersion), cfg)) {
            dispatch(setUpdateIsVisibleData(true));
          }

          safeGoSignInWithDelay(onboardingSeen);
          return;
        }

        const response = await authorization({});

        if (!response?.data?.success) {
          safeGoSignInWithDelay(onboardingSeen);
          return;
        }

        const {user, config} = response.data;

        if (isForceUpdateRequired(Number(productVersion), config)) {
          dispatch(setUser(user));
          resetTo('ForceUpdateScreen');
          return;
        }

        if (isOptionalUpdateAvailable(Number(productVersion), config)) {
          dispatch(setUpdateIsVisibleData(true));
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
        safeGoSignInWithDelay(onboardingSeen);
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
