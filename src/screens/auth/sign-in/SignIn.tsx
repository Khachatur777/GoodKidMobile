import {NavigationProp} from '@react-navigation/native';
import {Image, Keyboard, Platform, View} from 'react-native';
import React, {FC, useCallback, useContext, useEffect} from 'react';
import {BackgroundWrapper, Button, KeyboardAwareScrollView, PasswordField, Spacing, TextField,} from 'molecules';
import {Logo, LogoWhiteWord} from 'assets';
import {t} from 'i18next';
import {Formik} from 'formik';
import {signInValidationScheme} from './validations.ts';
import {signInStyles} from './sign-in-styles.ts';
import {
  setConfigData,
  setFilterData,
  setIsLoggedIn,
  setLanguageId,
  setSubscriptionUserData,
  setTokenData,
  setUser,
  useFilterMutation, useSignInAppleMutation,
  useSignInGoogleMutation,
  useSignInMutation, useSignUpAppleMutation,
  useSignUpGoogleMutation,
} from 'rtk';
import {useDispatch} from 'react-redux';
import {setItem} from 'configs';
import {getBuildNumber, getModel, getSystemVersion, getUniqueId, getVersion} from 'react-native-device-info';
import {ThemeContext} from "theme";
import Purchases from "react-native-purchases";
import {checkUserSubscription} from "hooks/usePurchase.ts";
import {signInWithGoogle, usePinAction} from "hooks";
import {IConfig, IUser} from "models";
import {appleAuth, AppleButton} from '@invertase/react-native-apple-authentication';


export interface SignInhProps {
  navigation: NavigationProp<any>;
}

const SignIn: FC<SignInhProps> = ({navigation}) => {
  const [signIn] = useSignInMutation();
  const [signInGoogle] = useSignInGoogleMutation();
  const [signInApple] = useSignInAppleMutation();
  const [signUpGoogle] = useSignUpGoogleMutation();
  const [signUpApple] = useSignUpAppleMutation();
  const [filter] = useFilterMutation();

  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const {startPinAction} = usePinAction();

  const initialValues = {email: '', password: ''};

  const versionNumber = Platform.OS === 'android' ? getVersion() : getBuildNumber();

  const goForceUpdate = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: 'ForceUpdateScreen'}],
    });
  }, [navigation]);

  const goHome = useCallback(() => {
    navigation.reset({
      routes: [{name: 'TabScreens', params: {screen: 'HomeTab'}}],
      index: 0,
    });
  }, [navigation]);

  const isForceUpdateRequired = useCallback(
    (config?: IConfig) => !!config?.forceUpdate && `${versionNumber}` !== `${config?.versionApp}`,
    [versionNumber],
  );

  const setRevenueCatUser = useCallback(
    async (user?: IUser) => {
      if (!user?.id) return;
      await Purchases.setAttributes({
        'E-mail': user?.email || '',
        'Name': `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim(),
        VersionNumber: String(versionNumber),
        LoginTime: new Date().toString(),
      });
      await Purchases.logIn(String(user.id));

    },
    [versionNumber],
  );

  const saveAuthToStore = useCallback(
    async (payload: {
      user: IUser;
      config?: IConfig;
      tokenData: { accessToken?: string; refreshToken?: string; expiresIn?: number }
    }) => {
      const {user, config, tokenData} = payload;

      // RevenueCat
      await setRevenueCatUser(user);

      // Subscription
      const userSubscription = await checkUserSubscription();
      dispatch(setSubscriptionUserData(!!userSubscription?.isSubscribed));

      // Redux
      dispatch(setIsLoggedIn(true));
      dispatch(setUser(user));
      dispatch(setLanguageId(user?.profile?.preferredLanguages));
      dispatch(setConfigData(config as any));

      dispatch(
        setTokenData({
          accessToken: tokenData?.accessToken as any,
          expiresIn: tokenData?.expiresIn as any,
          refreshToken: tokenData?.refreshToken as any,
        }),
      );

      // Storage
      await setItem('tokenData', {
        accessToken: tokenData?.accessToken,
        expiresIn: tokenData?.expiresIn,
        refreshToken: tokenData?.refreshToken,
      });

      // Filters
      const responseFilter = await filter({});
      if (responseFilter?.data?.success) {
        dispatch(setFilterData(responseFilter?.data?.filter)); // ✅ fixed
      }
    },
    [dispatch, filter, setRevenueCatUser],
  );

  const finalizeAuth = useCallback(
    async (responseData?: any) => {
      const config = responseData?.data?.config;

      if (isForceUpdateRequired(config)) {
        goForceUpdate();
        return;
      }

      const user = responseData?.data?.user;
      if (!user) return;

      await saveAuthToStore({
        user,
        config,
        tokenData: {
          accessToken: responseData?.data?.accessToken,
          refreshToken: responseData?.data?.refreshToken,
          expiresIn: responseData?.data?.expiresIn,
        },
      });

      goHome();
    },
    [goForceUpdate, goHome, isForceUpdateRequired, saveAuthToStore],
  );

  const buildGoogleSignUpPayload = useCallback(
    async (userInfo: any) => {
      const pinRes = await startPinAction();
      const pinCode = pinRes?.data;

      const deviceId = await getUniqueId();
      const deviceModel = getModel();
      const osVersion = getSystemVersion();
      const productVersion = Platform.OS === 'android' ? getVersion() : getBuildNumber();

      return {
        email: userInfo?.data?.user?.email?.trim?.().toLowerCase(),
        deviceId,
        deviceModel,
        osVersion,
        productVersion,
        pinCode,
        profile: {
          firstName: userInfo?.data?.user?.givenName,
          lastName: userInfo?.data?.user?.familyName,
        },
        showLoader: true,
        showModal: true,
      };
    },
    [startPinAction],
  );

  const buildAppleSignUpPayload = useCallback(
    async (userInfo: any) => {
      const pinRes = await startPinAction();
      const pinCode = pinRes?.data;

      const deviceId = await getUniqueId();
      const deviceModel = getModel();
      const osVersion = getSystemVersion();
      const productVersion = Platform.OS === 'android' ? getVersion() : getBuildNumber();

      return {
        email: userInfo?.email?.trim?.().toLowerCase() || '',
        deviceId,
        appleId: userInfo.user,
        deviceModel,
        osVersion,
        productVersion,
        pinCode,
        profile: {
          firstName: userInfo?.fullName?.givenName,
          lastName: userInfo?.fullName?.familyName,
        },
        showLoader: true,
        showModal: true,
      };
    },
    [startPinAction],
  );

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const {userInfo, tokens} = await signInWithGoogle();

      const email = userInfo?.data?.user?.email;
      const idToken = tokens?.idToken;
      if (!email || !idToken) return;

      const loginRes = await signInGoogle({
        email,
        googleToken: idToken,
        showModal: true,
        showLoader: true,
      });

      if (loginRes?.data?.success) {
        return finalizeAuth(loginRes?.data as any);
      }

      if (!loginRes?.data?.success && loginRes?.data?.googleSignUp) {
        const signUpPayload = await buildGoogleSignUpPayload(userInfo);
        const signUpRes = await signUpGoogle(signUpPayload);

        if (signUpRes?.data?.success) {
          return finalizeAuth(signUpRes?.data as any);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, [buildGoogleSignUpPayload, finalizeAuth, signInGoogle, signUpGoogle]);

  const handleEmailSignIn = useCallback(
    async (values: typeof initialValues) => {
      try {
        const email = values.email?.trim?.();
        const password = values.password;

        const response = await signIn({
          email,
          password,
          showModal: true,
          showLoader: true,
        });

        if (!response?.data?.success) return;

        if (response?.data?.checkEmail) {
          return navigation.navigate('SignUpVerify', {email});
        }

        return finalizeAuth(response?.data as any);
      } catch (e) {
        console.log(e);
      }
    },
    [finalizeAuth, navigation, signIn],
  );

  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const appleId = appleAuthRequestResponse?.user;
      const appleToken = appleAuthRequestResponse?.identityToken;
      if (!appleId || !appleToken) return;

      const loginRes = await signInApple({
        appleId,
        appleToken,
        showModal: true,
        showLoader: true,
      });

      if (loginRes?.data?.success) {
        return finalizeAuth(loginRes?.data as any);
      }
      if (!loginRes?.data?.success && loginRes?.data?.appleSignUp) {
        const signUpPayload = await buildAppleSignUpPayload(appleAuthRequestResponse);

        const signUpRes = await signUpApple(signUpPayload);

        if (signUpRes?.data?.success) {
          return finalizeAuth(signUpRes?.data as any);
        }
      }
    } catch (e) {
      console.log(e);
    }

  };

  return (
    <BackgroundWrapper includesSafeArea backgroundColor="bg_primary">
      <Formik
        onSubmit={handleEmailSignIn}
        initialValues={initialValues}
        validationSchema={signInValidationScheme}
      >
        {({setFieldValue, touched, handleSubmit, values, errors}) => (
          <KeyboardAwareScrollView
            enableOnAndroid
            showsVerticalScrollIndicator={false}
          >
            <View style={signInStyles().container}>

              <Image source={theme === 'dark' ? LogoWhiteWord : Logo} style={signInStyles().logo}/>
              <>
                <TextField
                  size="large"
                  value={values?.email}
                  onChangeText={e => {
                    setFieldValue('email', e);
                  }}
                  label={t('email_sign_in')}
                  explanation={
                    errors?.email && touched?.email
                      ? `${errors?.email}`
                      : ''
                  }
                  error={Boolean(errors.email && touched?.email)}
                />

                <PasswordField
                  size="large"
                  value={values.password}
                  onChangeText={e => {
                    setFieldValue('password', e);
                  }}
                  label={t('password_sign_in')}
                  error={Boolean(errors.password && touched?.password)}
                  explanation={errors?.password && touched?.password
                    ? `${errors?.password}`
                    : ''}
                />

                <Spacing size={8}/>

                <View style={signInStyles().btnContainer}>
                  <Button
                    size="large"
                    title={t('sign_in_btn')}
                    onPress={() => {
                      Keyboard.dismiss();
                      handleSubmit()
                    }}
                  />

                  <Spacing size={8}/>

                  <Button
                    startIconName={'Google'}
                    title={t('sign_with_google')}
                    onPress={() => {
                      Keyboard.dismiss();
                      handleGoogleSignIn()
                    }}
                    variant={'outline'}
                  />

                  <Spacing size={8}/>

                  {Platform.OS === 'ios' ?
                    <Button
                      startIconName={'Apple'}
                      title={t('sign_with_apple')}
                      onPress={() => {
                        Keyboard.dismiss();
                        signInWithApple()
                      }}
                      variant={'outline'}
                    />
                    :
                    null
                  }

                  <Button
                    variant="ghost"
                    title={t('forgot_password_btn')}
                    onPress={() => navigation.navigate('ForgotSendCode')}
                  />


                </View>
              </>
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>

      <Button
        variant="ghost"
        title={t('sign_up_text')}
        onPress={() => navigation.navigate('SignUp')}
      />
    </BackgroundWrapper>
  );
};

export default SignIn;
