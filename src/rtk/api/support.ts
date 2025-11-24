import { IDefaultResponseModel, ISupportSendMessageRequest } from 'models';
import { baseApi } from './base';
import { supportRoutes } from './routes';

export const supportApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SaveHomeUi'] })
  .injectEndpoints({
    endpoints: builder => ({
      sendMessage: builder.mutation<
        IDefaultResponseModel,
        ISupportSendMessageRequest
      >({
        query: body => {
          return {
            url: supportRoutes().supportSendMessage,
            method: 'POST',
            body,
          };
        },
      }),
    }),
    overrideExisting: false,
  });

export const {
  useSendMessageMutation
} = supportApi;
