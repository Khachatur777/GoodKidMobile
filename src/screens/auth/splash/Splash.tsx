import {NavigationProp} from '@react-navigation/native';
import {Image, Platform} from 'react-native';
import {splashStyles} from './splash-styles.ts';
import {FC, useCallback, useEffect} from 'react';
import {BackgroundWrapper} from 'molecules';
import {LogoMin} from 'assets';
import {
  setConfigData,
  setFilterData,
  setIsLoggedIn,
  setLanguageId,
  setSubscriptionUserData,
  setUser,
  useAuthorizationMutation,
  useFilterMutation,
} from 'rtk';
import {getItem} from 'configs';
import {useDispatch} from 'react-redux';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import i18n from "localization/localization.ts";
import {checkUserSubscription} from "hooks/usePurchase.ts";
import Purchases from "react-native-purchases";

export interface SplashProps {
  navigation: NavigationProp<any>;
}

const Splash: FC<SplashProps> = ({navigation}) => {
  const [authorization] = useAuthorizationMutation();
  const dispatch = useDispatch();
  const [filter] = useFilterMutation();

  const versionNumber =
    Platform.OS === 'android' ? getVersion() : getBuildNumber();

  const checkLogin = useCallback(async () => {
    try {
      const tokenData = await getItem('tokenData');
      const language = await getItem('language');

      if (language) {
        await i18n.changeLanguage(language);
      } else {
        await i18n.changeLanguage('en');
      }

      if (tokenData) {
        const response = await authorization({});
        if (response?.data?.success) {

          if (response?.data?.config?.forceUpdate && `${versionNumber}` !== `${response?.data?.config?.versionApp}`) {
            return navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'ForceUpdateScreen',
                },
              ],
            });
          }

          const user = response?.data?.user

          await Purchases.logIn(user?.id.toString());

          await Purchases.setAttributes({
            'E-mail': user?.email,
            'Name': `${user?.profile?.firstName} ${user?.profile?.lastName}`,
            "VersionNumber": versionNumber,
            "LoginTime": new Date().toString()
          });

          const userSubscription = await checkUserSubscription()


          dispatch(setSubscriptionUserData(userSubscription.isSubscribed))

          dispatch(setIsLoggedIn(true));
          dispatch(setUser(response?.data?.user));
          dispatch(setLanguageId(user?.profile?.preferredLanguages));
          dispatch(setConfigData(response?.data?.config));

          const responseFilter = await filter({});

          if (responseFilter?.data?.success) {
            dispatch(setFilterData(responseFilter?.data?.filter));
          }

          return navigation.reset({
            index: 0,
            routes: [
              {
                name: 'TabScreens',
              },
            ],
          });
        }
      }

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'TabScreens',
            },
          ],
        });
      }, 2000);
    } catch (e) {
    }

  }, [navigation]);

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <BackgroundWrapper containerStyles={splashStyles().container}>
      <Image source={LogoMin} style={splashStyles().logoMin}/>
    </BackgroundWrapper>
  );
};

export default Splash;
