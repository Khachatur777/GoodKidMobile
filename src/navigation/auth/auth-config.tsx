import {IScreens} from 'navigation/tabs';
import {
  Onboarding,
  Splash,
  SignIn,
  SignUp,
  ForgotChangePassword,
  ForgotSendCode,
  SignUpVerify,
  ForceUpdateScreen
} from 'screens';
import i18n from 'localization/localization';

export const authScreens: IScreens[] = [
  {
    name: 'Splash',
    component: Splash,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'Onboarding',
    component: Onboarding,
    options: {
      headerShown: false,
    },
  },
  {
    name: 'SignIn',
    component: SignIn,
    options: () => ({
      title: i18n.t('sign_in_title'),
      type: 'title',
      // There is nowhere to go back to: sign-in is reached by resetting the stack
      // — after signing out, from onboarding, or on launch without a session
      showBackIcon: false,
      showIconInTabScreen: true,
      backgroundColor: 'bg_primary'
    }),
  },
  {
    name: 'SignUp',
    component: SignUp,
    options: () => ({
      type: 'title',
      title: i18n.t('sign_up_title'),
      showBackIcon: true,
      showIconInTabScreen: true,
      backgroundColor: 'bg_primary'
    }),
  },
  {
    name: 'SignUpVerify',
    component: SignUpVerify,
    options: () => ({
      type: 'title',
      title: i18n.t('sign_up_verify_title'),
      showBackIcon: true,
      showIconInTabScreen: true,
      backgroundColor: 'bg_primary'
    }),
  },
  {
    name: 'ForgotSendCode',
    component: ForgotSendCode,
    options: () => ({
      type: 'title',
      title: i18n.t('forgot_send_code_title'),
      showBackIcon: true,
      showIconInTabScreen: true,
      backgroundColor: 'bg_primary'
    }),
  },
  {
    name: 'ForgotChangePassword',
    component: ForgotChangePassword,
    options: () => ({
      type: 'title',
      title: i18n.t('forgot_send_code_title'),
      showBackIcon: true,
      showIconInTabScreen: true,
      backgroundColor: 'bg_primary'
    }),
  },
  {
    name: 'ForceUpdateScreen',
    component: ForceUpdateScreen,
    options: () => ({
      type: 'title',
      title: i18n.t('force_update_title'),
      showBackIcon: false,
      showIconInTabScreen: true,
      backgroundColor: 'bg_primary'
    }),
  },

];
