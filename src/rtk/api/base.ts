import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {baseUrl, baseUrlIp, getItem} from 'configs';
import { ReduxStore } from 'rtk/types';
import { baseQueryWithReAuth } from '../config';
import { Platform } from 'react-native';
import {
  getBuildNumber,
  getModel,
  getSystemName,
  getSystemVersion,
  getUniqueId,
  getVersion,
} from 'react-native-device-info';
import { getTokenDataState, isLoggedInSelector } from 'rtk';

const baseQuery = fetchBaseQuery({
  baseUrl: __DEV__ ? baseUrlIp : baseUrl,
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as ReduxStore;
    const tokenData = await getItem('tokenData');

    const tokenDataSate = getTokenDataState(state);
    const isLoggedIn = isLoggedInSelector(state);

    const firstLogInToken =
      isLoggedIn && tokenDataSate?.accessToken
        ? tokenDataSate?.accessToken
        : tokenData?.accessToken
        ? tokenData?.accessToken
        : '';

    const versionNumber =
      Platform.OS === 'android' ? getVersion() : getBuildNumber();
    const deviceModel = getModel();
    const deviceId = await getUniqueId();
    const systemName = getSystemName();
    const osVersion = getSystemVersion();

    headers.set('Authorization', `Bearer ${firstLogInToken}`);
    headers.set('X-DeviceID', deviceId);
    headers.set('x-appbuildversion', versionNumber);
    headers.set('x-devicename', deviceModel);
    headers.set('X-os', systemName);
    headers.set('X-osversion', osVersion);

    return headers;
  },
});

// initialize an empty api service that we'll inject endpoints into later as needed
export const baseApi = createApi({
  reducerPath: 'mainApi',
  baseQuery: baseQueryWithReAuth(baseQuery),
  endpoints: () => ({}),
});
