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
  useSignUpVerifyMutation,
  useVerifyEmailAgainMutation,
} from 'rtk';
import { useTranslation } from 'react-i18next';
import {ThemeContext} from "theme";
import {useAuthSession} from "hooks";

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

  const [signUpVerify] = useSignUpVerifyMutation();

  const initialValues = {
    code: '',
  };

  const goForceUpdate = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{name: 'ForceUpdateScreen'}],
    });
  }, [navigation]);

  // Сразу после регистрации ведём родителя добавлять первого ребёнка: без
  // ребёнка ни фильтр, ни история смысла не имеют, а пустые экраны ничего не
  // объясняют. Экран можно пропустить — тогда останется обычный Home.
  const goHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'TabScreens',
          state: {
            index: 0,
            routes: [
              {
                name: 'ProfileTab',
                state: {index: 0, routes: [{name: 'AddFirstChildScreen'}]},
              },
            ],
          },
        },
      ],
    });
  }, [navigation]);

  useEffect(() => {
    if (resendLeft <= 0) return;
    const id = setInterval(() => setResendLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendLeft]);


  // Тот же общий сценарий, что и на экране входа: он держит лоадер до конца
  // и сам решает, куда вести — на Home или на обновление приложения.
  const {finalizeAuth, runAuthFlow} = useAuthSession({
    onAuthorized: goHome,
    onForceUpdate: goForceUpdate,
  });

  const onSubmit = useCallback(
    async (values: typeof initialValues) => {
      Keyboard.dismiss();

      await runAuthFlow(async () => {
        const response = await signUpVerify({
          email,
          code: values.code,
          showLoader: true,
          showModal: true,
        });

        if (!response?.data?.success) {
          // Об ошибке от сервера уже сказал showModal
          return response?.error || response?.data?.message ? 'silent' : false;
        }

        return finalizeAuth(response?.data as any);
      });
    },
    [email, finalizeAuth, runAuthFlow, signUpVerify],
  );

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
    } catch {}


  }, [email, resendLeft, verifyEmailAgain]);


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
