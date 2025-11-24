import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import i18n from 'localization/localization';
import { showGlobalError, showMainLoader } from '../reducers';

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => next => (action: any) => {
    if (__DEV__ && action?.meta?.baseQueryMeta?.request) {
      console.info(
        'log--request//',
        `${action?.meta?.baseQueryMeta?.request?.method || ''} ${
          action?.meta?.baseQueryMeta?.request?.url || ''
        } --->`,
        action?.meta?.baseQueryMeta?.request?.headers?.map,
        action?.meta?.baseQueryMeta?.request?._bodyInit,
      );
    }

    // Enable Loading
    if (action?.meta?.arg?.originalArgs?.showLoader) {
      api.dispatch(showMainLoader(true));
    }


    if (
      action?.meta?.arg?.originalArgs?.showModal &&
      action?.payload?.status !== 200 &&
      action?.payload?.data?.message
    ) {
      api.dispatch(
        showGlobalError({
          title: i18n.t('global_error_title'),
          description: i18n.t(action?.payload?.data?.message ),
          isVisible: true,
        }),
      );
    }

    if (
      action?.meta?.arg?.originalArgs?.showModal &&
      action?.payload?.status === 400 &&
      action?.payload?.data?.length
    ) {
      api.dispatch(
        showGlobalError({
          title: i18n.t('global_error_title'),
          description: i18n.t('global_error_description'),
          isVisible: true,
        }),
      );
    }

    if (
      action?.meta?.arg?.originalArgs?.showModal &&
      action?.payload?.status === 'FETCH_ERROR' &&
      action?.meta?.baseQueryMeta?.response?.status !== 401
    ) {
      api.dispatch(
        showGlobalError({
          title: i18n.t('global_error_title'),
          description: i18n.t('global_error_description'),
          isVisible: true,
        }),
      );
    }

    // Log Error Response When Request Is Failed
    if (isRejectedWithValue(action)) {


      // Disable Loading
      api.dispatch(showMainLoader(false));

      // Error Response Log Description
      if (__DEV__) {
        console.error(
          'log-error//',
          `${action?.meta?.baseQueryMeta?.request?.method || ''} ${
            action?.meta?.baseQueryMeta?.request?.url || ''
          } ${action?.payload?.status || ''} ${
            action?.payload?.data?.ResponseCode || ''
          }`,
          action?.payload,
        );
      }
    }

    // Log Response When Request Is Succeeded
    if (action?.meta?.baseQueryMeta?.response && !isRejectedWithValue(action)) {
      // Disable Loading
      api.dispatch(showMainLoader(false));

      // Success Log Description
      if (__DEV__) {
        console.info(
          'log--response//',
          `${action?.meta?.baseQueryMeta?.request?.method || ''} ${
            action?.meta?.baseQueryMeta?.request?.url || ''
          } Status ${action?.meta?.baseQueryMeta?.response?.status || ''} `,
          action?.payload,
        );
      }
    }

    return next(action);
  };
