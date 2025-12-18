import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import { Image, Keyboard, Platform, View } from 'react-native';
import { signUpVerifyStyles } from './sign-up-verify-styles.ts';
import {FC, useCallback, useContext, useEffect, useState} from 'react';
import {
  BackgroundWrapper,
  Button,
  KeyboardAwareScrollView,
  Spacing,
  TextField,
} from 'molecules';
import {Logo, LogoWhiteWord} from 'assets';
import { Formik } from 'formik';
import { signUnVerifyValidationScheme } from './validations.ts';
import {
  setConfigData, setFilterData,
  setIsLoggedIn, setLanguageId,
  setSubscriptionUserData, setTokenData,
  setUser,
  useSignUpVerifyMutation,
  useVerifyEmailAgainMutation
} from 'rtk';
import { useTranslation } from 'react-i18next';
import {ThemeContext} from "theme";
import {IConfig, IUser} from "models";
import {getBuildNumber, getVersion} from "react-native-device-info";
import {checkUserSubscription} from "hooks/usePurchase.ts";
import {setItem} from "configs";
import {useDispatch} from "react-redux";
import Purchases from "react-native-purchases";

export interface SignUpProps {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase> & {
    params: {
      email: string;
    };
  };
}

const SignUpVerify: FC<SignUpProps> = ({ navigation, route }) => {
  const email = route?.params?.email;
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [verifyEmailAgain] = useVerifyEmailAgainMutation()
  const [resendLeft, setResendLeft] = useState(15);
  const dispatch = useDispatch();

  const [signUpVerify] = useSignUpVerifyMutation();

  const initialValues = {
    code: '',
  };

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

  useEffect(() => {
    if (resendLeft <= 0) return;
    const id = setInterval(() => setResendLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendLeft]);


  const isForceUpdateRequired = useCallback(
    (config?: IConfig) => !!config?.forceUpdate && `${versionNumber}` !== `${config?.versionApp}`,
    [versionNumber],
  );

  const setRevenueCatUser = useCallback(
    async (user?: IUser) => {
      if (!user?.id) return;

      await Purchases.logIn(String(user.id));
      await Purchases.setAttributes({
        'E-mail': user?.email || '',
        'Name': `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim(),
        VersionNumber: String(versionNumber),
        LoginTime: new Date().toString(),
      });
    },
    [versionNumber],
  );

  const saveAuthToStore = useCallback(
    async (payload: {user: IUser; config?: IConfig; tokenData: {accessToken?: string; refreshToken?: string; expiresIn?: number}}) => {
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

    },
    [dispatch, setRevenueCatUser],
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

  const onSubmit = useCallback(async (values: typeof initialValues) => {
    try {
      const data = {
        email: email,
        code: values.code,
        showLoader: true,
        showModal: true,
      };

      const response = await signUpVerify(data);

      if (response?.data?.success) {
        return finalizeAuth(response?.data as any);
      }

    } catch (error) {
      console.error('Sign up error:', error);
    }
  }, []);


  const onResend = useCallback(async () => {
    try {
      if (resendLeft > 0) return;
      setResendLeft(15);

      const data = {
        email,
        showLoader: true,
        showModal: true
      }
      verifyEmailAgain(data)
    } catch (e){}


  }, [resendLeft, email]);


  return (
    <BackgroundWrapper backgroundColor="bg_primary">
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={signUnVerifyValidationScheme}
      >
        {({ setFieldValue, touched, handleSubmit, values, errors }) => (
          <KeyboardAwareScrollView
            extraScrollHeight={Platform.OS === 'android' ? 180 : 130}
            extraHeight={Platform.OS === 'android' ? 180 : 130}
            enableOnAndroid
            contentContainerStyle={signUpVerifyStyles().scrollContainer}
            showsVerticalScrollIndicator={false}>

            <View style={signUpVerifyStyles().container}>

              <Image source={theme === 'dark' ? LogoWhiteWord : Logo} style={signUpVerifyStyles().logo} />

              <TextField
                size="large"
                value={values?.code}
                onChangeText={e => {
                  setFieldValue('code', e);
                }}
                keyboardType={'numeric'}
                label={t('verify_code')}
                explanation={
                  errors?.code && touched?.code
                    ? `${errors?.code}`
                    : ''
                }
                error={Boolean(errors.code && touched?.code)}
              />

            </View>

            <View style={signUpVerifyStyles().btnContainer}>
              <Button
                variant={'outline'}
                size="large"
                title={
                  resendLeft > 0
                    ? `${t('resend_code')} (${resendLeft})`
                    : t('resend_code')
                }
                disabled={resendLeft > 0}
                onPress={async () => {
                  Keyboard.dismiss();
                  onResend();
                }}
              />

              <Spacing size={16} />

              <Button
                size="large"
                title={t('sign_up_verify_btn')}
                onPress={async () => {
                  Keyboard.dismiss();
                  handleSubmit();
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>
    </BackgroundWrapper>
  );
};

export default SignUpVerify;
