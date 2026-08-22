export interface IDefaultResponseModel {
  message?: string;
  success?: boolean;
  googleSignUp?: boolean;
  appleSignUp?: boolean;
}

export type UserRole = 'parent' | 'child';

export interface IUser {
  id: string;
  role: UserRole;
  email?: string;
  profile?: {
    firstName: string;
    lastName: string;
    preferredLanguages: string;
    preferredCategories: string[];
  };
  subscription: string;
  isVerified?: boolean;
  // Поля ребёнка: приходят, когда role === 'child'
  parentId?: string;
  name?: string;
  age?: number;
  avatar?: string;
  login?: string;
  language?: string;
  appearance?: {
    accent?: string | null;
    themeMode?: 'light' | 'dark' | 'system';
  };
}

export interface IConfigFeatures {
  paymentsEnabled?: boolean;
  supportChatEnabled?: boolean;
  // Лимиты приходят с сервера, приложение их не зашивает
  maxChildren?: number;
  maxChildrenFree?: number;
  activityDays?: number;
  activityDaysFree?: number;
}

export interface IConfigAppearance {
  availableAccents?: string[];
}

export interface IConfig {
  update: boolean;
  forceUpdate?: boolean;
  versionAppIos?: number;
  versionAppAndroid?: number;
  features?: IConfigFeatures;
  appearance?: IConfigAppearance;
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
    versionAppIos: number,
    versionAppAndroid: number,
    iosFilterEnable?: boolean,
    features?: IConfigFeatures,
    appearance?: IConfigAppearance,
  }
}


