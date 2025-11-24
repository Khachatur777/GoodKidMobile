import {
  IBaseRequestModel,
  IFilterEditRequestModel,
  IFilterEditResponseModel,
  IFilterItemsResponseModel,
} from 'models';
import { baseApi } from './base';
import { filterRoutes } from './routes';

export const filterApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SaveHomeUi'] })
  .injectEndpoints({
    endpoints: builder => ({
      editFilter: builder.mutation<
        IFilterEditResponseModel,
        IFilterEditRequestModel
      >({
        query: (body) => {
          return {
            url: filterRoutes().editFilter,
            method: 'POST',
            body,
          };
        },
      }),

      getFilter: builder.query<
        IFilterItemsResponseModel,
        IBaseRequestModel
      >({
        query: () => {
          return {
            url: filterRoutes().getFilter,
            method: 'GET',
          };
        },
      }),

      filter: builder.mutation<
        IFilterItemsResponseModel,
        IBaseRequestModel
      >({
        query: () => {
          return {
            url: filterRoutes().getFilter,
            method: 'GET',
          };
        },
      }),

    }),
    overrideExisting: false,
  });

export const {
  useEditFilterMutation,
  useGetFilterQuery,
  useFilterMutation
} = filterApi;
