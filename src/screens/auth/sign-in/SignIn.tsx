import {NavigationProp} from '@react-navigation/native';
import {Image, Keyboard, Platform, View} from 'react-native';
import React, {FC, useCallback, useContext} from 'react';
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
  useFilterMutation,
  useSignInMutation,
} from 'rtk';
import {useDispatch} from 'react-redux';
import {setItem} from 'configs';
import {getBuildNumber, getVersion} from 'react-native-device-info';
import {ThemeContext} from "theme";
import Purchases from "react-native-purchases";
import {checkUserSubscription} from "hooks/usePurchase.ts";

export interface SignInhProps {
  navigation: NavigationProp<any>;
}

const SignIn: FC<SignInhProps> = ({ navigation }) => {
  const [signIn] = useSignInMutation();
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [filter] = useFilterMutation();

  const initialValues = {
    email: '',
    password: '',
  };

  const versionNumber =
    Platform.OS === 'android' ? getVersion() : getBuildNumber();

  const onSubmit = useCallback(async (values: typeof initialValues) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
        showModal: true,
        showLoader: true,
      };

      const response = await signIn(data);

      if (response?.data?.success) {

        if(response?.data?.checkEmail){
          return navigation.navigate('SignUpVerify', { email: data.email });
        }

        if (response?.data?.data?.config?.forceUpdate && `${versionNumber}` !== `${response?.data?.data?.config?.versionApp}`) {
          return navigation.reset({
            index: 0,
            routes: [
              {
                name: 'ForceUpdateScreen',
              },
            ],
          });
        }

        const user = response?.data?.data?.user

        await Purchases.logIn(user?.id.toString()!);

        await Purchases.setAttributes({
          'E-mail': user?.email!,
          'Name': `${user?.profile?.firstName} ${user?.profile?.lastName}`,
          "VersionNumber": versionNumber,
          "LoginTime": new Date().toString()
        });

        const userSubscription = await checkUserSubscription()


        dispatch(setSubscriptionUserData(userSubscription.isSubscribed))

        dispatch(setIsLoggedIn(true));
        dispatch(setUser(user!));
        dispatch(setTokenData({
          accessToken: response?.data?.data?.accessToken!,
          expiresIn: response?.data?.data?.expiresIn!,
          refreshToken: response?.data?.data?.refreshToken!,
        }));
        await setItem('tokenData', {
          accessToken: response?.data?.data?.accessToken,
          expiresIn: response?.data?.data?.expiresIn,
          refreshToken: response?.data?.data?.refreshToken,
        });
        dispatch(setLanguageId(user?.profile?.preferredLanguages!));
        dispatch(setConfigData(response?.data?.data?.config!));

        const responseFilter = await filter({});

        if (responseFilter?.data?.success) {
          dispatch(setFilterData(responseFilter?.data?.filter));
        }

        navigation.reset({
          routes: [
            {
              name: 'TabScreens',
              params: {
                screen: 'HomeTab',
              },
            },
          ],
          index: 0,
        });
      }

    } catch (e) {
      console.log(e);
    }
  }, [dispatch, filter, navigation, signIn, versionNumber]);

  return (
    <BackgroundWrapper includesSafeArea backgroundColor="bg_primary">
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={signInValidationScheme}
      >
        {({ setFieldValue, touched, handleSubmit, values, errors }) => (
          <KeyboardAwareScrollView
            enableOnAndroid
            showsVerticalScrollIndicator={false}
          >
            <View style={signInStyles().container}>

              <Image source={theme === 'dark' ? LogoWhiteWord : Logo} style={signInStyles().logo} />
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
                  explanation={    errors?.password && touched?.password
                    ? `${errors?.password}`
                    : ''}
                />

                <Spacing size={8} />

                <View style={signInStyles().btnContainer}>
                  <Button
                    size="large"
                    title={t('sign_in_btn')}
                    onPress={() => {
                      Keyboard.dismiss();
                      handleSubmit()
                    }}
                  />

                  <Spacing size={8} />

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
