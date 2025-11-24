import { IBaseRequestModel } from 'models';

export interface ISignUpRequestModel extends IBaseRequestModel {
  email: string;
  password: string;
  deviceId: string;
  deviceModel: string;
  osVersion: string;
  productVersion: string;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface ISignInRequestModel extends IBaseRequestModel {
  email: string;
  password: string;
}

export interface ISignUpVerifyRequestModel extends IBaseRequestModel {
  email: string;
  code: string;
}

export interface IVerifyEmailAgainRequestModel extends IBaseRequestModel {
  email: string;
}

export interface IForgotSendCodeRequestModel extends IBaseRequestModel {
  email: string;
}

export interface IForgotChangePasswordRequestModel extends IBaseRequestModel {
  email: string;
  code: string;
  newPassword: string;
}

