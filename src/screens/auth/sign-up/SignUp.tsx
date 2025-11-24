import { NavigationProp } from '@react-navigation/native';
import { Image, Keyboard, Platform, Pressable, View } from 'react-native';
import { signUpStyles } from './sign-up-styles.ts';
import React, {FC, useCallback, useContext, useRef, useState} from 'react';
import {
  BackgroundWrapper,
  Button,
  KeyboardAwareScrollView,
  PasswordField,
  Radio,
  TextField,
  Typography,
} from 'molecules';
import {Logo, LogoWhiteWord} from 'assets';
import { Formik } from 'formik';
import { signUpValidationScheme } from './validations.ts';
import { useSignUpMutation } from 'rtk/api';
import {
  getBuildNumber,
  getModel,
  getSystemVersion,
  getUniqueId,
  getVersion,
} from 'react-native-device-info';
import { validateThen } from 'utils';
import { usePinAction } from 'hooks';
import { useTranslation } from 'react-i18next';
import { TermsModal } from 'organisms';
import { showGlobalError } from 'rtk';
import { useDispatch } from 'react-redux';
import {ThemeContext} from "theme";

export interface SignUpProps {
  navigation: NavigationProp<any>;
}

const SignUp: FC<SignUpProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [signUpReq] = useSignUpMutation();
  const { theme } = useContext(ThemeContext);
  const formikRef = useRef(null);
  const dispatch = useDispatch();
  const [termsModal, setTermsModal] = useState<boolean>(false);
  const [termsSelected, setTermsSelected] = useState<boolean>(false);

  const {startPinAction} = usePinAction();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const onSubmit = useCallback(async (values: typeof initialValues) => {
    try {

      if(!termsSelected){
       return  dispatch(
          showGlobalError({
            title: t('validation_error'),
            description: t('check_terms'),
            isVisible: true,
          }),
        );
      }

      const pinRes = await startPinAction();
      const pinCode = pinRes?.data;

      const deviceId = await getUniqueId();
      const deviceModel = getModel();
      const osVersion = getSystemVersion();
      const productVersion = Platform.OS === 'android' ? getVersion() : getBuildNumber();

      const data = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        deviceId,
        deviceModel,
        osVersion,
        productVersion,
        pinCode,
        profile: {
          firstName: values.firstName,
          lastName: values.lastName,
        },
        showLoader: true,
        showModal: true,
      };

      const response = await signUpReq(data)

      if(response?.data?.success){
        navigation.navigate('SignUpVerify', { email: data.email });
      }

    } catch (err) {
      console.error('Sign up failed:', err);
    }
  }, [navigation, signUpReq, termsSelected, startPinAction]);



  return (
    <BackgroundWrapper backgroundColor="bg_primary">
      <Formik
        innerRef={formikRef}
        onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={signUpValidationScheme}
      >
        {({ setFieldValue, touched, handleSubmit, values, errors }) => (
          <KeyboardAwareScrollView
            extraScrollHeight={Platform.OS === 'android' ? 180 : 130}
            extraHeight={Platform.OS === 'android' ? 180 : 130}
            enableOnAndroid
            contentContainerStyle={signUpStyles().scrollContainer}
            showsVerticalScrollIndicator={false}>

            <View style={signUpStyles().container}>

              <Image source={theme === 'dark' ? LogoWhiteWord : Logo} style={signUpStyles().logo} />

              <TextField
                size="large"
                value={values?.firstName}
                onChangeText={e => {
                  setFieldValue('firstName', e);
                }}
                label={t('first_name_up')}
                explanation={
                  errors?.firstName && touched?.firstName
                    ? `${errors?.firstName}`
                    : ''
                }
                error={Boolean(errors.firstName && touched?.firstName)}
              />

              <TextField
                size="large"
                value={values?.lastName}
                onChangeText={e => {
                  setFieldValue('lastName', e);
                }}
                label={t('last_name_up')}
                explanation={
                  errors?.lastName && touched?.lastName
                    ? `${errors?.lastName}`
                    : ''
                }
                error={Boolean(errors.lastName && touched?.lastName)}
              />

              <TextField
                size="large"
                value={values?.email}
                onChangeText={e => {
                  setFieldValue('email', e);
                }}
                label={t('email_sign_up')}
                keyboardType={'email-address'}
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
                label={t('password_sign_up')}
                error={Boolean(errors.password && touched?.password)}
                explanation={    errors?.password && touched?.password
                  ? `${errors?.password}`
                  : ''}
              />

              <PasswordField
                size="large"
                value={values.confirmPassword}
                onChangeText={e => {
                  setFieldValue('confirmPassword', e);
                }}
                label={t('confirm_password_sign_up')}
                error={Boolean(errors.confirmPassword && touched?.confirmPassword)}
                explanation={    errors?.confirmPassword && touched?.confirmPassword
                  ? `${errors?.confirmPassword}`
                  : ''}
              />

              <View style={signUpStyles().termsContainer}>
                <Radio
                  id={'terms'}
                  selected={termsSelected}
                  onPress={() => {
                    setTermsSelected(!termsSelected);
                  }}
                />

                <Pressable onPress={() => setTermsModal(true)} style={signUpStyles().termsText}>
                  <Typography numberOfLines={2} type={'bodyL'}>
                    {t('terms_title')}
                  </Typography>
                </Pressable>
              </View>

              <View style={signUpStyles().btnContainer}>
                <Button
                  size="large"
                  title={t('sign_up_btn')}
                  onPress={async () => {
                    Keyboard.dismiss();

                    await validateThen(async () => {

                      handleSubmit()

                    }, formikRef?.current);

                  }}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </Formik>

      {termsModal ?
        <TermsModal
          isVisible={termsModal}
          setIsVisible={setTermsModal}
        />
        :
        null}
    </BackgroundWrapper>
  );
};

export default SignUp;
