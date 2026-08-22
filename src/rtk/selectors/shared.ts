import {createSelector} from 'reselect';
import {SharedState} from 'rtk/reducers';

export const getSharedState = (state: {shared: SharedState}) => state.shared;

export const getGlobalError = createSelector(
  getSharedState,
  data => data.globalErrorModal,
);

export const getMainLoadingState = createSelector(
  getSharedState,
  data => data.isLoading,
);

export const isLoggedInSelector = createSelector(
  getSharedState,
  data => data.isLoggedIn,
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

// Платежи включаются рубильником features.paymentsEnabled из бэкенд-конфига
export const getPaymentsEnabledState = createSelector(
  getConfigDataState,
  config => config?.features?.paymentsEnabled === true,
);

// Контент заблокирован, только если платежи включены и подписки нет
export const getContentLockedState = createSelector(
  getPaymentsEnabledState,
  getSubscriptionUserState,
  (paymentsEnabled, isSubscribed) => paymentsEnabled && !isSubscribed,
);

export const getAvailableAccentsState = createSelector(
  getConfigDataState,
  config =>
    config?.appearance?.availableAccents?.length
      ? config.appearance.availableAccents
      : ['#6B4EE6', '#E14A24', '#2F6BFF'],
);

export const getUpdateState = createSelector(
  getSharedState,
  data => data.updateIsVisible,
);

export const getRoleState = createSelector(
  getSharedState,
  data => data.role,
);

// Детский интерфейс: три таба, без фильтров и без родительских разделов
export const getIsChildState = createSelector(
  getSharedState,
  data => data.role === 'child',
);

export const getChildrenState = createSelector(
  getSharedState,
  data => data.children,
);

export const getActiveChildIdState = createSelector(
  getSharedState,
  data => data.activeChildId,
);

export const getOnboardingSeenState = createSelector(
  getSharedState,
  data => data.onboardingSeen,
);

export const getParentalGatePassedAtState = createSelector(
  getSharedState,
  data => data.parentalGatePassedAt,
);

export const getRememberedKidLoginState = createSelector(
  getSharedState,
  data => data.rememberedKidLogin,
);
