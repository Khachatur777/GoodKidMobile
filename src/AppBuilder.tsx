import {Platform, StyleSheet, View} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {GlobalErrorModal, UpdateModal} from 'organisms';
import {Loader} from 'molecules';
import {useDispatch, useSelector} from 'react-redux';
import {getMainLoadingState, getNetInfo, setNetInfo} from 'rtk';
import {navigationRef} from 'helpers';
import {useContext, useEffect} from 'react';
import {ThemeContext} from 'theme';
import {useToast, configureGoogleSignIn} from 'hooks';
import Toast from 'react-native-toast-message';
import {RootNavigator} from 'navigation';
import {addEventListener} from '@react-native-community/netinfo';
import {NoInternetConnection} from 'screens/no-internet-connection';
import Purchases, {LOG_LEVEL} from "react-native-purchases";
import {purchaseKeyAndroid, purchaseKeyDebug, purchaseKeyIos} from "configs";

const AppBuilder = () => {
  const {theme} = useContext(ThemeContext);
  const isLoading = useSelector(getMainLoadingState);
  const isConnected = useSelector(getNetInfo);
  const {toastConfig} = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.INFO);
    const apiKey =
      __DEV__
        ? purchaseKeyDebug
        :
        Platform.OS === 'ios'
          ? purchaseKeyIos
          : purchaseKeyAndroid;

    if (!apiKey) {
      return;
    }

    Purchases.configure({apiKey});
  }, []);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // Connection state used to be written on every request and read by nobody, so
  // the offline screen never appeared. The system tells us instead, the moment
  // it changes.
  useEffect(() => addEventListener(state => {
    dispatch(setNetInfo(!!state.isConnected));
  }), [dispatch]);

  return (
    <View style={{flex: 1}} pointerEvents="box-none">
      <NavigationContainer
        ref={navigationRef}
        theme={theme === 'dark' ? DarkTheme : DefaultTheme}>

        <RootNavigator/>

        <Toast config={toastConfig} position="bottom" bottomOffset={60}/>

        <GlobalErrorModal/>

        <UpdateModal/>
      </NavigationContainer>

      <Loader isLoading={isLoading}/>

      {/* Over everything: with no connection there is nothing the app can do */}
      {!isConnected && (
        <View style={StyleSheet.absoluteFill}>
          <NoInternetConnection/>
        </View>
      )}

    </View>
  );
};

export default AppBuilder;
