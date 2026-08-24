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
  // How many flows are currently holding the loader. A request clears it when
  // the response arrives, but signing in takes several steps and continues past
  // that response — the counter keeps the spinner up through the whole flow.
  loaderHold: number;
  theme: string;
  isLoggedIn: boolean | null;
  languageId: string | null;
  isTabBarHidden: boolean;
  subscriptionStatus: boolean;
  netInfo: boolean;
  updateIsVisible: boolean;
  user: IUser | null;
  // Who signed in. This decides which interface and which tabs to show.
  role: UserRole | null;
  // The parent's children and the one selected in the filter
  children: IChild[];
  activeChildId: string | null;
  // Onboarding is shown once per device
  onboardingSeen: boolean;
  // A passed parental gate lasts until the end of the session
  parentalGatePassedAt: number | null;
  // The child's login is remembered on the device, the password never is
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
  loaderHold: 0,
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


