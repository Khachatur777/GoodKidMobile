import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  sharedReducerInitialState,
  SharedState,
  ISharedTokenDataState, ISharedFilterDaraState,
} from './shared-state';
import { IChild, IConfig, IUser, UserRole } from 'models';

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

    // Holds the loader for a whole flow: true takes it, false releases it.
    // Counted rather than toggled, so nested flows do not clear each other.
    holdMainLoader: (state, action: PayloadAction<boolean>) => {
      state.loaderHold = Math.max(0, state.loaderHold + (action.payload ? 1 : -1));
      // The flow is over — clear the per-request flag too: if a request died on
      // the way, the spinner would otherwise stay on screen forever
      if (state.loaderHold === 0) state.isLoading = false;
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
      // The role always travels with the user, so the two cannot drift apart
      state.role = action.payload?.role ?? null;
    },

    setRole: (state, action: PayloadAction<UserRole | null>) => {
      state.role = action.payload;
    },

    setChildren: (state, action: PayloadAction<IChild[]>) => {
      state.children = action.payload;

      // The selected child may have been deleted — fall back to the first one
      const stillExists = state.children.some(child => child.id === state.activeChildId);
      if (!stillExists) {
        state.activeChildId = state.children[0]?.id ?? null;
      }
    },

    setActiveChildId: (state, action: PayloadAction<string | null>) => {
      state.activeChildId = action.payload;
    },

    setOnboardingSeen: (state, action: PayloadAction<boolean>) => {
      state.onboardingSeen = action.payload;
    },

    setParentalGatePassedAt: (state, action: PayloadAction<number | null>) => {
      state.parentalGatePassedAt = action.payload;
    },

    setRememberedKidLogin: (state, action: PayloadAction<string | null>) => {
      state.rememberedKidLogin = action.payload;
    },

    setTokenData: (state, action: PayloadAction<ISharedTokenDataState | null>) => {
      state.tokenData = action.payload;
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

    setUpdateIsVisibleData: (state, action: PayloadAction<boolean>) => {
      state.updateIsVisible = action.payload;
    },
  },
});

export const sharedReducer = sharedSlice.reducer;

export const {
  showMainLoader,
  holdMainLoader,
  showGlobalError,
  hideTabBar,
  updateTheme,
  setIsLoggedIn,
  setUser,
  setRole,
  setChildren,
  setActiveChildId,
  setOnboardingSeen,
  setParentalGatePassedAt,
  setRememberedKidLogin,
  setTokenData,
  showSplashScreen,
  setLanguageId,
  setFilterData,
  setConfigData,
  setSubscriptionUserData,
  setNetInfo,
  setUpdateIsVisibleData
} = sharedSlice.actions;
