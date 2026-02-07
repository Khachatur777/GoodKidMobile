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

export interface ISignInUpGuestRequestModel extends IBaseRequestModel {
  deviceId: string;
  deviceModel: string;
  osVersion: string;
  productVersion: string;
}

export interface ISignUpGoogleRequestModel extends IBaseRequestModel {
  email: string;
  deviceId: string;
  deviceModel: string;
  osVersion: string;
  productVersion: string;
  pinCode: number;
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface ISignUpAppleRequestModel extends IBaseRequestModel {
  email: string;
  deviceId: string;
  deviceModel: string;
  appleId: string;
  osVersion: string;
  productVersion: string;
  pinCode: number;
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

export interface ISignInGoogleRequestModel extends IBaseRequestModel {
  email: string;
  googleToken: string;
}

export interface ISignInAppleRequestModel extends IBaseRequestModel {
  appleId: string;
  appleToken: string;
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

