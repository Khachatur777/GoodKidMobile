import {
  IChildVideoLockRequestModel,
  IUpdateVideoLockRequestModel,
  IVideoLockResponseModel,
  IVideoUnlockResponseModel,
} from 'models';
import { baseApi } from './base';
import { videoLockRoutes } from './routes';

export const videoLockApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['VideoLock', 'LearningProgress'] })
  .injectEndpoints({
    endpoints: builder => ({
      getMyVideoLock: builder.query<IVideoLockResponseModel, void>({
        query: () => ({
          url: videoLockRoutes().myLock,
          method: 'GET',
        }),
        providesTags: ['VideoLock'],
      }),

      // Оплата тратит звёзды, поэтому баланс тоже устаревает: карточка звёзд в
      // профиле ребёнка и экран задач читают его же.
      unlockVideo: builder.mutation<IVideoUnlockResponseModel, void>({
        query: () => ({
          url: videoLockRoutes().unlock,
          method: 'POST',
        }),
        invalidatesTags: ['VideoLock', 'LearningProgress'],
      }),

      getChildVideoLock: builder.query<IVideoLockResponseModel, IChildVideoLockRequestModel>({
        query: ({ id }) => ({
          url: videoLockRoutes().childLock(id),
          method: 'GET',
        }),
        providesTags: ['VideoLock'],
      }),

      updateChildVideoLock: builder.mutation<IVideoLockResponseModel, IUpdateVideoLockRequestModel>({
        query: ({ id, ...body }) => ({
          url: videoLockRoutes().childLock(id),
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['VideoLock'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetMyVideoLockQuery,
  useLazyGetMyVideoLockQuery,
  useUnlockVideoMutation,
  useGetChildVideoLockQuery,
  useLazyGetChildVideoLockQuery,
  useUpdateChildVideoLockMutation,
} = videoLockApi;
