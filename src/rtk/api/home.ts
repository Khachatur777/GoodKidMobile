import {
  IGetVideoSearchTitleRequestModel,
  IGetVideoSearchTitleResponse,
  IKidsVideosResponse,
} from 'models';
import { baseApi } from './base';
import { homeRoutes } from './routes';
import { IGetVideoRequestModel } from 'models';

export const homeApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SaveHomeUi'] })
  .injectEndpoints({
    endpoints: builder => ({
      getAllHomeVideos: builder.mutation<
        IKidsVideosResponse,
        IGetVideoRequestModel
      >({
        query: (body) => {
          return {
            url: homeRoutes().getAllHomeVideos,
            method: 'POST',
            body
          };
        },
      }),
      // How many videos the filter leaves. Asked while the parent taps chips,
      // so it must never raise the global loader.
      getVideosCount: builder.mutation<
        {success?: boolean; data?: {count: number}},
        {categories?: number[]; language?: string; age?: number}
      >({
        query: (body) => {
          return {
            url: homeRoutes().getVideosCount,
            method: 'POST',
            body,
          };
        },
      }),
      getSearchTitleVideos: builder.mutation<
        IGetVideoSearchTitleResponse,
        IGetVideoSearchTitleRequestModel
      >({
        query: (body) => {
          return {
            url: homeRoutes().getSearchTitleVideos,
            method: 'POST',
            body
          };
        },
      }),

    }),
    overrideExisting: false,
  });

export const {
  useGetAllHomeVideosMutation,
  useGetVideosCountMutation,
  useGetSearchTitleVideosMutation,
} = homeApi;
