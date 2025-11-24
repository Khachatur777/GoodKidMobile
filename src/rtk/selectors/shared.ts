import {createSelector} from 'reselect';
import {SharedState} from 'rtk/reducers';

export const getSharedState = (state: {shared: SharedState}) => state.shared;

export const getGlobalError = createSelector(
  getSharedState,
  data => data.globalErrorModal,
);

export const getPinState = createSelector(
  getSharedState,
  data => data.isPinVisible,
);

export const getMainLoadingState = createSelector(
  getSharedState,
  data => data.isLoading,
);

export const isLoggedInSelector = createSelector(
  getSharedState,
  data => data.isLoggedIn,
);

export const pinAsyncFnSelector = createSelector(
  getSharedState,
  data => data.pinAsyncFn,
);

export const getIsTabBarHiddenState = createSelector(
  getSharedState,
  data => data.isTabBarHidden,
);

export const getUserState = createSelector(
  getSharedState,
  data => data.user,
);

export const getTokenDataState = createSelector(
  getSharedState,
  data => data.tokenData,
);

export const getFilterDataState = createSelector(
  getSharedState,
  data => data.filterData,
);

export const getConfigDataState = createSelector(
  getSharedState,
  data => data.configData,
);

export const getLanguageIdForRefetchTranslations = createSelector(
  getSharedState,
  data => data.languageId,
);

export const getNetInfo = createSelector(getSharedState, data => data.netInfo);

export const getSubscriptionUserState = createSelector(
  getSharedState,
  data => data.subscriptionStatus,
);
