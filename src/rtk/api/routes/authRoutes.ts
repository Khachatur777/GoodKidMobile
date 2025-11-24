export const authRoutes = (version: string = 'v1') => {
  return {
    signUp: `/${version}/auth/sign-up`,
    signIn: `/${version}/auth/sign-in`,
    authorization: `/${version}/auth/authorization`,
    signUpVerify: `/${version}/auth/sign-up-verify`,
    verifyEmailAgain: `/${version}/auth/verify-email-again`,
    forgotSendCode: `/${version}/auth/forgot/send/code`,
    forgotChangePassword: `/${version}/auth//forgot/change/password`,
    refreshToken: `/${version}/auth/refresh-token`,
  };
};

