export const authRoutes = (version: string = 'v1') => {
  return {
    signUp: `/${version}/auth/sign-up`,
    signUpGoogle: `/${version}/auth/sign-up/google`,
    signUpApple: `/${version}/auth/sign-up/apple`,
    signIn: `/${version}/auth/sign-in`,
    signInUpGuest: `/${version}/auth/guest/sign-up-in`,
    signInGoogle: `/${version}/auth/sign-in/google`,
    signInApple: `/${version}/auth/sign-in/apple`,
    authorization: `/${version}/auth/authorization`,
    signUpVerify: `/${version}/auth/sign-up-verify`,
    verifyEmailAgain: `/${version}/auth/verify-email-again`,
    forgotSendCode: `/${version}/auth/forgot/send/code`,
    forgotChangePassword: `/${version}/auth/forgot/change/password`,
    config: `/${version}/auth/config`,
    refreshToken: `/${version}/auth/refresh-token`,
  };
};

