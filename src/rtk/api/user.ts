import { IBaseRequestModel, IDefaultResponseModel } from 'models';
import { baseApi } from './base';
import { userRoutes } from './routes';

export const userApi = baseApi
  .enhanceEndpoints({ addTagTypes: [] })
  .injectEndpoints({
    endpoints: builder => ({
      userDelete: builder.mutation<
        IDefaultResponseModel,
        IBaseRequestModel
      >({
        query: () => {
          return {
            url: userRoutes().userDelete,
            method: 'DELETE',
          };
        },
      }),

    }),
    overrideExisting: false,
  });

export const {
  useUserDeleteMutation,
} = userApi;
