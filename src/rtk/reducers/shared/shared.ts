import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  sharedReducerInitialState,
  SharedState,
  ISharedTokenDataState, ISharedFilterDaraState,
} from './shared-state';
import { IConfig, IUser } from 'models';

export const sharedSlice = createSlice({
  name: 'shared',
  initialState: sharedReducerInitialState,
  reducers: {
    showSplashScreen: (state, action: PayloadAction<boolean>) => {
      state.showSplashScreen = action.payload;
    },

    showMainLoader: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Mainly we are hiding TabBar from TabBar component: there is an array named as hideTabBarFromScreens , we add screen name there and it automatically hides tab bar
    // But when we add screens conditionally that method does not work that is why we created this state to hide that specific screens
    hideTabBar: (state, action: PayloadAction<boolean>) => {
      state.isTabBarHidden = action.payload;
    },

    showGlobalError: (
      state,
      action: PayloadAction<SharedState['globalErrorModal']>,
    ) => {
      state.globalErrorModal = action.payload;
    },

    setPinVisible: (state, action: PayloadAction<boolean>) => {
      state.isPinVisible = action.payload;
    },

    setNetInfo: (state, action: PayloadAction<boolean>) => {
      state.netInfo = action.payload;
    },

    updateTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },

    setIsLoggedIn: (state, action: PayloadAction<boolean | null>) => {
      state.isLoggedIn = action.payload;
    },

    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
    },

    setTokenData: (state, action: PayloadAction<ISharedTokenDataState | null>) => {
      state.tokenData = action.payload;
    },

    setPinAsyncFn: (state, action: PayloadAction<any>) => {
      state.pinAsyncFn = action.payload;
    },

    setLanguageId: (state, action: PayloadAction<string | null>) => {
      state.languageId = action.payload;
    },

    setFilterData: (state, action: PayloadAction<ISharedFilterDaraState>) => {
      state.filterData = action.payload;
    },

    setSubscriptionUserData: (state, action: PayloadAction<boolean>) => {
      state.subscriptionStatus = action.payload;
    },

    setConfigData: (state, action: PayloadAction<IConfig>) => {
      state.configData = action.payload;
    },
  },
});

export const sharedReducer = sharedSlice.reducer;

export const {
  showMainLoader,
  showGlobalError,
  hideTabBar,
  updateTheme,
  setPinVisible,
  setIsLoggedIn,
  setUser,
  setTokenData,
  showSplashScreen,
  setLanguageId,
  setPinAsyncFn,
  setFilterData,
  setConfigData,
  setSubscriptionUserData,
  setNetInfo
} = sharedSlice.actions;
