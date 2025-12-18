export interface IDefaultResponseModel {
  message?: string;
  success?: boolean;
  googleSignUp?: boolean;
}

export interface IUser {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    preferredLanguages: string;
    preferredCategories: string[];
  };
  subscription: string;
  pinCode: number;
  isVerified: boolean;
}

export interface IConfig {
  forceUpdate: boolean,
  update: boolean,
  versionApp: number,
  iosFilterEnable?: boolean
}

export interface ISignInResponseModel extends IDefaultResponseModel{
  checkEmail?: boolean;
  data?: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    config?: IConfig
  }
}

export interface IAuthorizationResponseModel extends IDefaultResponseModel{
  user: IUser,
  config: IConfig
}

export interface IConfigResponseModel extends IDefaultResponseModel{
  data: {
    forceUpdate: boolean,
    update: boolean,
    versionApp: number,
    iosFilterEnable?: boolean
  }
}


