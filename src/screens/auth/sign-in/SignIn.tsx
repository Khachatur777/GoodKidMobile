import { NavigationProp } from '@react-navigation/native';
import { Keyboard, Platform, View } from 'react-native';
import React, { FC, useCallback, useState } from 'react';
import {GoodKidLogo, BackgroundWrapper,
  Button,
  KeyboardAwareScrollView,
  KidAvatar,
  PasswordField,
  SegmentedControl,
  Spacing,
  TextField,
  Typography,} from 'molecules';
import { t } from 'i18next';
import { Formik } from 'formik';
import { signInValidationScheme } from './validations.ts';
import { signInStyles } from './sign-in-styles.ts';
import {
  getRememberedKidLoginState,
  setRememberedKidLogin,
  useSignInAppleMutation,
  useSignInChildMutation,
  useSignInGoogleMutation,
  useSignInMutation,
  useSignUpAppleMutation,
  useSignUpGoogleMutation,
} from 'rtk';
import { useDispatch, useSelector } from 'react-redux';
import { setItem } from 'configs';
import {
  getBuildNumber,
  getModel,
  getSystemVersion,
  getUniqueId,
  getVersion,
} from 'react-native-device-info';
import { signInWithGoogle, useAuthSession } from 'hooks';
import { appleAuth } from '@invertase/react-native-apple-authentication';

export interface SignInhProps {
  navigation: NavigationProp<any>;
}

const SignIn: FC<SignInhProps> = ({navigation}) => {
  const [signIn] = useSignInMutation();
  const [signInGoogle] = useSignInGoogleMutation();
  const [signInApple] = useSignInAppleMutation();
  const [signUpGoogle] = useSignUpGoogleMutation();
  const [signUpApple] = useSignUpAppleMutation();
  const [signInChild] = useSignInChildMutation();

  const dispatch = useDispatch();

  // Роль выбирается переключателем: у родителя почта и соцвход, у ребёнка —
  // только логин с паролем, которые ему завёл родитель.
  const [role, setRole] = useState<'parent' | 'child'>('parent');
  const rememberedKidLogin = useSelector(getRememberedKidLoginState);
  const [kidLogin, setKidLogin] = useState(rememberedKidLogin || '');
  const [kidPassword, setKidPassword] = useState('');

  const initialValues = {email: '', password: ''};


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

  // Запись сессии, RevenueCat и переход живут в общем хуке: он же держит
  // лоадер до самого Home, чтобы спиннер не пропадал на экране входа.
  const {finalizeAuth, runAuthFlow, showAuthError} = useAuthSession({
    onAuthorized: goHome,
    onForceUpdate: goForceUpdate,
  });

  const buildGoogleSignUpPayload = useCallback(
    async (userInfo: any) => {
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
        profile: {
          firstName: userInfo?.data?.user?.givenName,
          lastName: userInfo?.data?.user?.familyName,
        },
        showLoader: true,
        showModal: true,
      };
    },
    [],
  );

  const buildAppleSignUpPayload = useCallback(
    async (userInfo: any) => {
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
        profile: {
          firstName: userInfo?.fullName?.givenName,
          lastName: userInfo?.fullName?.familyName,
        },
        showLoader: true,
        showModal: true,
      };
    },
    [],
  );

  const handleGoogleSignIn = useCallback(async () => {
    // Системное окно выбора аккаунта показываем до лоадера: под ним спиннер
    // ни к чему, а отмена выбора — не ошибка.
    let googleResult;
    try {
      googleResult = await signInWithGoogle();
    } catch (e) {
      console.log(e);
      return;
    }

    const {userInfo, tokens} = googleResult || {};
    const email = userInfo?.data?.user?.email;
    const idToken = tokens?.idToken;
    if (!email || !idToken) return;

    await runAuthFlow(async () => {
      const loginRes = await signInGoogle({
        email,
        googleToken: idToken,
        showModal: true,
        showLoader: true,
      });

      if (loginRes?.data?.success) {
        return finalizeAuth(loginRes?.data as any);
      }

      // Аккаунта ещё нет — заводим его и входим тем же сценарием
      if (loginRes?.data?.googleSignUp) {
        const signUpPayload = await buildGoogleSignUpPayload(userInfo);
        const signUpRes = await signUpGoogle(signUpPayload);

        if (signUpRes?.data?.success) {
          return finalizeAuth(signUpRes?.data as any);
        }
      }

      // Сообщение об ошибке уже показал showModal — второй раз не показываем
      return loginRes?.error || loginRes?.data?.message ? 'silent' : false;
    });
  }, [
    buildGoogleSignUpPayload,
    finalizeAuth,
    runAuthFlow,
    signInGoogle,
    signUpGoogle,
  ]);

  const handleEmailSignIn = useCallback(
    async (values: typeof initialValues) => {
      const email = values.email?.trim?.().toLowerCase();
      const password = values.password;

      await runAuthFlow(async () => {
        const response = await signIn({
          email,
          password,
          showModal: true,
          showLoader: true,
        });

        if (!response?.data?.success) {
          return response?.error || response?.data?.message ? 'silent' : false;
        }

        if (response?.data?.checkEmail) {
          navigation.navigate('SignUpVerify', {email});
          return true;
        }

        return finalizeAuth(response?.data as any);
      });
    },
    [finalizeAuth, navigation, runAuthFlow, signIn],
  );

  const signInWithApple = useCallback(async () => {
    // Как и у Google: системное окно показываем без спиннера, отмена — молча
    let appleAuthRequestResponse;
    try {
      appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
    } catch (e) {
      console.log(e);
      return;
    }

    const appleId = appleAuthRequestResponse?.user;
    const appleToken = appleAuthRequestResponse?.identityToken;
    if (!appleId || !appleToken) return;

    await runAuthFlow(async () => {
      const loginRes = await signInApple({
        appleId,
        appleToken,
        showModal: true,
        showLoader: true,
      });

      if (loginRes?.data?.success) {
        return finalizeAuth(loginRes?.data as any);
      }

      if (loginRes?.data?.appleSignUp) {
        const signUpPayload = await buildAppleSignUpPayload(appleAuthRequestResponse);
        const signUpRes = await signUpApple(signUpPayload);

        if (signUpRes?.data?.success) {
          return finalizeAuth(signUpRes?.data as any);
        }
      }

      return loginRes?.error || loginRes?.data?.message ? 'silent' : false;
    });
  }, [
    buildAppleSignUpPayload,
    finalizeAuth,
    runAuthFlow,
    signInApple,
    signUpApple,
  ]);

  const handleKidSignIn = useCallback(async () => {
    Keyboard.dismiss();

    const login = kidLogin.trim().toLowerCase();
    // Ребёнку молчание непонятнее всего: короткий логин объясняем словами
    if (login.length < 4 || kidPassword.length < 6) {
      return showAuthError(t('sign_in_kid_credentials_hint'));
    }

    await runAuthFlow(async () => {
      const response = await signInChild({
        login,
        password: kidPassword,
        showModal: true,
        showLoader: true,
      });

      if (!response?.data?.success) {
        return response?.error || response?.data?.message ? 'silent' : false;
      }

      // Запоминаем только логин: пароль на устройстве не храним никогда.
      dispatch(setRememberedKidLogin(login));
      await setItem('kidLogin', login);

      return finalizeAuth(response?.data as any);
    });
  }, [
    dispatch,
    finalizeAuth,
    kidLogin,
    kidPassword,
    runAuthFlow,
    showAuthError,
    signInChild,
  ]);

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

              <GoodKidLogo size={76} variant="stacked" />

              <Spacing size={16} />

              <SegmentedControl
                items={[
                  {value: 'parent', title: t('sign_in_role_parent')},
                  {value: 'child', title: t('sign_in_role_kid')},
                ]}
                value={role}
                onChange={value => setRole(value as 'parent' | 'child')}
              />

              <Spacing size={20} />

              {role === 'child' ? (
                <>
                  {rememberedKidLogin ? (
                    <>
                      <KidAvatar size={84} />
                      <Spacing size={12} />
                      <Typography type="title3">
                        {t('sign_in_welcome_back', {name: rememberedKidLogin})}
                      </Typography>
                      <Spacing size={16} />
                    </>
                  ) : null}

                  <TextField
                    size="large"
                    value={kidLogin}
                    onChangeText={setKidLogin}
                    autoCapitalize="none"
                    label={t('sign_in_login_label')}
                    placeholder={t('sign_in_login_placeholder')}
                  />

                  <PasswordField
                    size="large"
                    value={kidPassword}
                    onChangeText={setKidPassword}
                    label={t('password_sign_in')}
                  />

                  <Spacing size={8} />

                  <View style={signInStyles().btnContainer}>
                    <Button
                      size="large"
                      title={t('sign_in_btn')}
                      onPress={handleKidSignIn}
                    />
                  </View>
                </>
              ) : (
              <>
                <TextField
                  size="large"
                  value={values?.email}
                  onChangeText={e => {
                    setFieldValue('email', e);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
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
              )}
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>

      {/* Регистрируется только родитель */}
      {role === 'parent' ? (
        <Button
          variant="ghost"
          title={t('sign_up_text')}
          onPress={() => navigation.navigate('SignUp')}
        />
      ) : null}
    </BackgroundWrapper>
  );
};

export default SignIn;
