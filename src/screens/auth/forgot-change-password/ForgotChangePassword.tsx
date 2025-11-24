import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import { Image, Keyboard, Platform, View } from 'react-native';
import { forgotChangePasswordStyles } from './forgot-change-password-styles.ts';
import {FC, useCallback, useContext, useEffect, useState} from 'react';
import { BackgroundWrapper, Button, KeyboardAwareScrollView, PasswordField, Spacing, TextField } from 'molecules';
import {Logo, LogoWhiteWord} from 'assets';
import { Formik } from 'formik';
import { forgotChangePasswordValidationScheme } from './validations.ts';
import { useTranslation } from 'react-i18next';
import {
  useForgotChangePasswordMutation,
  useVerifyEmailAgainMutation,
} from 'rtk';
import {ThemeContext} from "theme";

export interface SignUpProps {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase> & {
    params: {
      email: string;
    };
  };
}

const ForgotChangePassword: FC<SignUpProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [forgotChangePassword] = useForgotChangePasswordMutation()
  const [verifyEmailAgain] = useVerifyEmailAgainMutation()
  const email = route.params?.email
  const [resendLeft, setResendLeft] = useState(15);

  const initialValues = {
    code: '',
    newPassword: '',
    confirmPassword: '',

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
        newPassword: values.newPassword,
        code: values.code,
        showLoader: true,
        showModal: true,
      };
      const response = await forgotChangePassword(data)

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
        validationSchema={forgotChangePasswordValidationScheme}
      >
        {({ setFieldValue, touched, handleSubmit, values, errors }) => (
          <KeyboardAwareScrollView
            extraScrollHeight={Platform.OS === 'android' ? 180 : 130}
            extraHeight={Platform.OS === 'android' ? 180 : 130}
            enableOnAndroid
            contentContainerStyle={forgotChangePasswordStyles().scrollContainer}
            showsVerticalScrollIndicator={false}>

            <View style={forgotChangePasswordStyles().container}>

              <Image source={theme === 'dark' ? LogoWhiteWord : Logo} style={forgotChangePasswordStyles().logo} />

              <TextField
                size="large"
                value={values?.code}
                onChangeText={e => {
                  setFieldValue('code', e);
                }}
                keyboardType={'numeric'}
                label={t('code_forgot')}
                explanation={
                  errors?.code && touched?.code
                    ? `${errors?.code}`
                    : ''
                }
                error={Boolean(errors.code && touched?.code)}
              />

              <PasswordField
                size="large"
                value={values.newPassword}
                onChangeText={e => {
                  setFieldValue('newPassword', e);
                }}
                label={t('new_password_forgot')}
                error={!!errors.newPassword}
                explanation={errors.newPassword || ''}
              />

              <PasswordField
                size="large"
                value={values.confirmPassword}
                onChangeText={e => {
                  setFieldValue('confirmPassword', e);
                }}
                label={t('confirm_password_forgot')}
                error={!!errors.confirmPassword}
                explanation={errors.confirmPassword || ''}
              />

            </View>

            <View style={forgotChangePasswordStyles().btnContainer}>
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
                title={t('forgot_btn')}
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

export default ForgotChangePassword;
