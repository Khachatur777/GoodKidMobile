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

    // Only the request that asked for the loader controls it: otherwise a
    // background response clears someone else's spinner
    const ownsLoader = !!action?.meta?.arg?.originalArgs?.showLoader;

    // Enable Loading
    if (ownsLoader) {
      if (String(action?.type).endsWith('/pending')) {
        api.dispatch(showMainLoader(true));
      } else {
        // Clear it on a cancelled request too, or the spinner stays up
        api.dispatch(showMainLoader(false));
      }
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


      // Error Response Log Description
      const emptyLanguageLesson =
        action?.meta?.arg?.endpointName === 'startWords' &&
        action?.payload?.status === 409 &&
        action?.payload?.data?.message === 'language.empty';
      if (__DEV__ && !emptyLanguageLesson) {
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
