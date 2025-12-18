export const authRoutes = (version: string = 'v1') => {
  return {
    signUp: `/${version}/auth/sign-up`,
    signUpGoogle: `/${version}/auth/sign-up/google`,
    signIn: `/${version}/auth/sign-in`,
    signInGoogle: `/${version}/auth/sign-in/google`,
    authorization: `/${version}/auth/authorization`,
    signUpVerify: `/${version}/auth/sign-up-verify`,
    verifyEmailAgain: `/${version}/auth/verify-email-again`,
    forgotSendCode: `/${version}/auth/forgot/send/code`,
    forgotChangePassword: `/${version}/auth/forgot/change/password`,
    config: `/${version}/auth/config`,
    refreshToken: `/${version}/auth/refresh-token`,
  };
};

