import { IConfig, IUser } from 'models';

export interface ISharedTokenDataState {
  accessToken: string,
  expiresIn: number,
  refreshToken: string,
};

export interface ISharedFilterDaraState {
  categories: number[];
  language: string;
  age: string | number;
};

export type SharedState = {
  showSplashScreen: boolean;
  isLoading: boolean;
  isPinVisible: boolean;
  theme: string;
  isLoggedIn: boolean | null;
  languageId: string | null;
  isTabBarHidden: boolean;
  subscriptionStatus: boolean;
  netInfo: boolean;
  user: IUser | null;
  tokenData: ISharedTokenDataState | null;
  globalErrorModal: {
    title: string;
    description: string;
    isVisible: boolean;
  };
  pinAsyncFn: any;
  filterData: ISharedFilterDaraState,
  configData: IConfig | null
};

export const sharedReducerInitialState: SharedState = {
  showSplashScreen: false,
  isLoading: false,
  isPinVisible: false,
  subscriptionStatus: false,
  theme: '',
  isLoggedIn: null,
  languageId: null,
  isTabBarHidden: false,
  netInfo: true,
  user: null,
  tokenData: null,
  pinAsyncFn: null!,
  globalErrorModal: {
    title: '',
    description: '',
    isVisible: false,
  },
  filterData: {
    categories: [],
    language: '',
    age: '',
  },
  configData: null
};


