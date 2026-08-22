import { IChild, IConfig, IUser, UserRole } from 'models';

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
  theme: string;
  isLoggedIn: boolean | null;
  languageId: string | null;
  isTabBarHidden: boolean;
  subscriptionStatus: boolean;
  netInfo: boolean;
  updateIsVisible: boolean;
  user: IUser | null;
  // Кто вошёл. От этого зависит, какой интерфейс и какие табы показывать.
  role: UserRole | null;
  // Дети родителя и выбранный в фильтре ребёнок
  children: IChild[];
  activeChildId: string | null;
  // Онбординг показывается один раз на устройство
  onboardingSeen: boolean;
  // Пройденный parental gate действует до конца сессии
  parentalGatePassedAt: number | null;
  // Логин ребёнка запоминается на устройстве, пароль — никогда
  rememberedKidLogin: string | null;
  tokenData: ISharedTokenDataState | null;
  globalErrorModal: {
    title: string;
    description: string;
    isVisible: boolean;
  };
  filterData: ISharedFilterDaraState,
  configData: IConfig | null
};

export const sharedReducerInitialState: SharedState = {
  showSplashScreen: false,
  isLoading: false,
  subscriptionStatus: false,
  theme: '',
  isLoggedIn: null,
  languageId: null,
  isTabBarHidden: false,
  updateIsVisible: false,
  netInfo: true,
  user: null,
  role: null,
  children: [],
  activeChildId: null,
  onboardingSeen: false,
  parentalGatePassedAt: null,
  rememberedKidLogin: null,
  tokenData: null,
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


