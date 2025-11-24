import {Platform, View} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {GlobalErrorModal, Pin} from 'organisms';
import {Loader} from 'molecules';
import {useSelector} from 'react-redux';
import {getMainLoadingState, getNetInfo} from 'rtk';
import {navigationRef} from 'helpers';
import {useContext, useEffect} from 'react';
import {ThemeContext} from 'theme';
import {useToast} from 'hooks';
import Toast from 'react-native-toast-message';
import {RootNavigator} from 'navigation';
import Purchases, {LOG_LEVEL} from "react-native-purchases";
import {purchaseKeyAndroid, purchaseKeyDebug, purchaseKeyIos} from "configs";

const AppBuilder = () => {
  const {theme} = useContext(ThemeContext);
  const isLoading = useSelector(getMainLoadingState);
  const {toastConfig} = useToast();
  const isInternetConnected = useSelector(getNetInfo);

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.INFO);
    const apiKey =
      __DEV__
        ? purchaseKeyDebug
        : Platform.OS === 'ios'
          ? purchaseKeyIos
          : purchaseKeyAndroid;

    if (!apiKey) {
      return;
    }

    Purchases.configure({apiKey});
  }, []);

  return (
    <View style={{flex: 1}} pointerEvents="box-none">
      <NavigationContainer
        ref={navigationRef}
        theme={theme === 'dark' ? DarkTheme : DefaultTheme}>

        <Pin>
          <RootNavigator/>
        </Pin>

        <Toast config={toastConfig} position="bottom" bottomOffset={60}/>

        <GlobalErrorModal/>
      </NavigationContainer>

      <Loader isLoading={isLoading}/>


    </View>
  );
};

export default AppBuilder;
