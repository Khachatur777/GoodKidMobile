import {
  IAuthorizationResponseModel,
  IBaseRequestModel, IConfigResponseModel,
  IDefaultResponseModel,
  IForgotChangePasswordRequestModel,
  IForgotSendCodeRequestModel, ISignInGoogleRequestModel,
  ISignInRequestModel,
  ISignInResponseModel, ISignUpGoogleRequestModel,
  ISignUpRequestModel,
  ISignUpVerifyRequestModel,
  IVerifyEmailAgainRequestModel,
} from 'models';
import { baseApi } from './base';
import { authRoutes } from './routes';

export const authApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Auth'] })
  .injectEndpoints({
    endpoints: builder => ({
      signIn: builder.mutation<
        ISignInResponseModel,
        ISignInRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().signIn,
            method: 'POST',
            body,
          };
        },
      }),
      signInGoogle: builder.mutation<
        ISignInResponseModel,
        ISignInGoogleRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().signInGoogle,
            method: 'POST',
            body,
          };
        },
      }),
      authorization: builder.mutation<
        IAuthorizationResponseModel,
        IBaseRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().authorization,
            method: 'POST',
            body,
          };
        },
      }),
      signUp: builder.mutation<
        IDefaultResponseModel,
        ISignUpRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().signUp,
            method: 'POST',
            body,
          };
        },
      }),
      signUpGoogle: builder.mutation<
        IDefaultResponseModel,
        ISignUpGoogleRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().signUpGoogle,
            method: 'POST',
            body,
          };
        },
      }),
      signUpVerify: builder.mutation<
        ISignInResponseModel,
        ISignUpVerifyRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().signUpVerify,
            method: 'POST',
            body,
          };
        },
      }),
      verifyEmailAgain: builder.mutation<
        IDefaultResponseModel,
        IVerifyEmailAgainRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().verifyEmailAgain,
            method: 'POST',
            body,
          };
        },
      }),
      forgotSendCode: builder.mutation<
        IDefaultResponseModel,
        IForgotSendCodeRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().forgotSendCode,
            method: 'POST',
            body,
          };
        },
      }),
      forgotChangePassword: builder.mutation<
        IDefaultResponseModel,
        IForgotChangePasswordRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().forgotChangePassword,
            method: 'POST',
            body,
          };
        },
      }),
      config: builder.mutation<
        IConfigResponseModel,
        IBaseRequestModel
      >({
        query: (body) => {
          return {
            url: authRoutes().config,
            method: 'POST',
            body,
          };
        },
      }),
      refreshToken: builder.mutation<
        IAuthorizationResponseModel,
        { refreshToken: string }
      >({
        query: (body) => {
          return {
            url: authRoutes().refreshToken,
            method: 'POST',
            body,
          };
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignUpVerifyMutation,
  useForgotSendCodeMutation,
  useForgotChangePasswordMutation,
  useAuthorizationMutation,
  useRefreshTokenMutation,
  useVerifyEmailAgainMutation,
  useSignInGoogleMutation,
  useSignUpGoogleMutation,
  useConfigMutation
} = authApi;

