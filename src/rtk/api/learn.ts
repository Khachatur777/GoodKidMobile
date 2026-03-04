import {
  IBaseRequestModel,
  IDefaultResponseModel,
  ILearnCategory,
  ILearnCategoryItemsRequestModel,
  ILearnCategoryItemsResponseModel,
  IViewLearnItemsRequestModel,
} from 'models';
import { baseApi } from './base';
import { learnRoutes } from './routes';

export const learnApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SaveHomeUi'] })
  .injectEndpoints({
    endpoints: builder => ({
      getAllLearnCategory: builder.query<ILearnCategory, IBaseRequestModel>({
        query: () => {
          return {
            url: learnRoutes().allLearnCategory,
            method: 'GET',
          };
        },
      }),
      getAllLearnCategoryItems: builder.query<
        ILearnCategoryItemsResponseModel,
        ILearnCategoryItemsRequestModel
      >({
        query: ({ categoryId, limit }) => {
          return {
            url: `${
              learnRoutes().allLearnCategoryItems
            }?categoryId=${categoryId}&limit=${limit}`,
            method: 'GET',
          };
        },
      }),
      viewLearnItems: builder.mutation<
        IDefaultResponseModel,
        IViewLearnItemsRequestModel
      >({
        query: body => {
          return {
            url: learnRoutes().viewLearnItems,
            method: 'POST',
            body,
          };
        },
      }),
      viewLearnItemsReset: builder.mutation<
        IDefaultResponseModel,
        IBaseRequestModel
      >({
        query: () => {
          return {
            url: learnRoutes().viewLearnItemsReset,
            method: 'POST',
          };
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetAllLearnCategoryQuery,
  useGetAllLearnCategoryItemsQuery,
  useViewLearnItemsMutation,
  useViewLearnItemsResetMutation
} =
  learnApi;
