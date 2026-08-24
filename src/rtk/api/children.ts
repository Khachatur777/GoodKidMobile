import {
  IBaseRequestModel,
  IChangeChildPasswordRequestModel,
  IChildActivityRequestModel,
  IChildActivityResponseModel,
  IChildFilterRequestModel,
  IChildFilterResponseModel,
  IChildResponseModel,
  IChildrenResponseModel,
  ICreateChildRequestModel,
  IDefaultResponseModel,
  IUpdateChildRequestModel,
  IVideoActivityRequestModel,
} from 'models';
import { baseApi } from './base';
import { childrenRoutes } from './routes';

export const childrenApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Children', 'ChildFilter', 'ChildActivity'] })
  .injectEndpoints({
    endpoints: builder => ({
      getChildren: builder.query<IChildrenResponseModel, IBaseRequestModel | void>({
        query: () => ({
          url: childrenRoutes().children,
          method: 'GET',
        }),
        providesTags: ['Children'],
      }),

      createChild: builder.mutation<IChildResponseModel, ICreateChildRequestModel>({
        query: (body) => ({
          url: childrenRoutes().children,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Children'],
      }),

      updateChild: builder.mutation<IChildResponseModel, IUpdateChildRequestModel>({
        query: ({ id, ...body }) => ({
          url: childrenRoutes().child(id),
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['Children'],
      }),

      changeChildPassword: builder.mutation<IDefaultResponseModel, IChangeChildPasswordRequestModel>({
        query: ({ id, ...body }) => ({
          url: childrenRoutes().childPassword(id),
          method: 'PATCH',
          body,
        }),
      }),

      deleteChild: builder.mutation<IDefaultResponseModel, { id: string }>({
        query: ({ id }) => ({
          url: childrenRoutes().child(id),
          method: 'DELETE',
        }),
        invalidatesTags: ['Children', 'ChildFilter', 'ChildActivity'],
      }),

      getChildFilter: builder.query<IChildFilterResponseModel, { id: string }>({
        query: ({ id }) => ({
          url: childrenRoutes().childFilter(id),
          method: 'GET',
        }),
        providesTags: ['ChildFilter'],
      }),

      editChildFilter: builder.mutation<IChildFilterResponseModel, IChildFilterRequestModel>({
        query: ({ id, ...body }) => ({
          url: childrenRoutes().childFilter(id),
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['ChildFilter'],
      }),

      getChildActivity: builder.query<IChildActivityResponseModel, IChildActivityRequestModel>({
        query: ({ id, days, type }) => ({
          url: childrenRoutes().childActivity(id),
          method: 'GET',
          params: {
            ...(days ? { days } : {}),
            ...(type ? { type } : {}),
          },
        }),
        providesTags: ['ChildActivity'],
      }),

      // The player calls this at the start and then with the accumulated time.
      // The server records history for a child token only and ignores a parent's views.
      recordVideoActivity: builder.mutation<IDefaultResponseModel, IVideoActivityRequestModel>({
        query: (body) => ({
          url: childrenRoutes().videoActivity,
          method: 'POST',
          body,
        }),
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetChildrenQuery,
  useLazyGetChildrenQuery,
  useCreateChildMutation,
  useUpdateChildMutation,
  useChangeChildPasswordMutation,
  useDeleteChildMutation,
  useGetChildFilterQuery,
  useLazyGetChildFilterQuery,
  useEditChildFilterMutation,
  useGetChildActivityQuery,
  useLazyGetChildActivityQuery,
  useRecordVideoActivityMutation,
} = childrenApi;
