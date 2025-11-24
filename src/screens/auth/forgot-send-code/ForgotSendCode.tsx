import { NavigationProp } from '@react-navigation/native';
import { Image, Keyboard, Platform, View } from 'react-native';
import { forgotSendCodeStyles } from './forgot-send-code-styles.ts';
import {FC, useCallback, useContext} from 'react';
import { BackgroundWrapper, Button, KeyboardAwareScrollView, TextField, Typography } from 'molecules';
import {Logo, LogoWhiteWord} from 'assets';
import { Formik } from 'formik';
import { forgotSendCodeValidationScheme } from './validations.ts';
import { useTranslation } from 'react-i18next';
import { useForgotSendCodeMutation } from 'rtk';
import {ThemeContext} from "theme";

export interface SignUpProps {
  navigation: NavigationProp<any>;
}

const ForgotSendCode: FC<SignUpProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [forgotSendCode] = useForgotSendCodeMutation()

  const initialValues = {
    email: '',
  };

  const onSubmit = useCallback(async (values: typeof initialValues) => {
    try {
      const data = {
        email: values.email,
        showLoader: true,
        showModal: true,
      };
      const response = await forgotSendCode(data)

      if (response?.data?.success) {
        navigation.navigate('ForgotChangePassword', {email: values.email});
      }

    } catch (error) {
      console.error('Sign up error:', error);
    }
  }, []);


  return (
    <BackgroundWrapper backgroundColor="bg_primary">
      <Formik
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={forgotSendCodeValidationScheme}
      >
        {({ setFieldValue, touched, handleSubmit, values, errors }) => (
          <KeyboardAwareScrollView
            extraScrollHeight={Platform.OS === 'android' ? 180 : 130}
            extraHeight={Platform.OS === 'android' ? 180 : 130}
            enableOnAndroid
            contentContainerStyle={forgotSendCodeStyles().scrollContainer}
            showsVerticalScrollIndicator={false}>

            <View style={forgotSendCodeStyles().container}>

              <Image source={theme === 'dark' ? LogoWhiteWord : Logo} style={forgotSendCodeStyles().logo} />

              <TextField
                size="large"
                value={values?.email}
                onChangeText={e => {
                  setFieldValue('email', e);
                }}
                keyboardType={'email-address'}
                label={t(t('email_forgot'))}
                explanation={
                  errors?.email && touched?.email
                    ? `${errors?.email}`
                    : ''
                }
                error={Boolean(errors.email && touched?.email)}
              />

              <Typography type={'bodyBold'}>
                {t('your_email_address_send_code_check')}
              </Typography>

            </View>

            <View style={forgotSendCodeStyles().btnContainer}>
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

export default ForgotSendCode;
