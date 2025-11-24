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
import { useSignUpVerifyMutation, useVerifyEmailAgainMutation } from 'rtk';
import { useTranslation } from 'react-i18next';
import {ThemeContext} from "theme";

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

  useEffect(() => {
    if (resendLeft <= 0) return;
    const id = setInterval(() => setResendLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendLeft]);

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
        navigation.navigate('SignIn');
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
