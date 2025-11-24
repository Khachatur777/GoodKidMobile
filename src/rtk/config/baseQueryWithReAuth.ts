import type {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import {fetch} from '@react-native-community/netinfo';
import { signOut } from 'helpers';
import i18n from 'localization/localization';
import {setNetInfo, setTokenData, showGlobalError} from '../reducers';
import { getItem, setItem } from 'configs';

let refreshing: Promise<void> | null = null;

export const baseQueryWithReAuth = (
  baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
) => {
  return async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: any,
  ) => {
    // Set Network Information

    fetch().then(state => {
      api.dispatch(setNetInfo(state.isConnected ? state.isConnected : false));
    });

    let result = await baseQuery(args, api, extraOptions);
    const tokenData = await getItem('tokenData');


    const refreshToken = tokenData?.refreshToken;
    const accessToken = tokenData?.accessToken;

    /* @ts-ignore */
    if (result?.data?.status === 423 && api?.endpoint !== 'signOut') {
      signOut();
      api.dispatch(
        showGlobalError({
          isVisible: true,
          title: i18n.t('user_blocked_error_title'),
          description: i18n.t('user_blocked_error_description'),
        }),
      );
    }

    if (
      result?.error?.status === 401 &&
      api?.endpoint !== 'signOut' &&
      api?.endpoint !== 'refreshToken' &&
      accessToken &&
      refreshToken
    ) {
      // Проверяем, что ошибка связана с истекшим токеном
      const errorData = result?.error?.data as any;
      if (errorData?.error === 'token.expired') {
        if (refreshing) {
          await refreshing;
        } else {
          refreshing = (async () => {
            const refreshResult = await baseQuery(
              {
                url: '/v1/auth/refresh-token',
                body: {
                  refreshToken: refreshToken,
                },
                method: 'POST',
                headers: {},
              },
              api,
              extraOptions,
            );

            if (__DEV__) {
              console.log(
                `Refresh TOKEN: /api/v1/auth/refresh-token`,
                refreshResult,
              );
            }

            if ((refreshResult?.data as any)?.success) {
              const newTokenData = (refreshResult.data as any)?.data;
              const tokenData = {
                accessToken: newTokenData.accessToken,
                refreshToken: newTokenData.refreshToken,
                expiresIn: newTokenData.expiresIn,
              };

              api.dispatch(setTokenData(tokenData));
              await setItem('tokenData', tokenData);
            } else if (refreshResult?.error?.status === 401) {
              signOut();
            }
          })();

          try {
            await refreshing;
          } finally {
            refreshing = null;
          }
        }

        result = await baseQuery(args, api, extraOptions);
      }
    }


    return result;
  };
};
