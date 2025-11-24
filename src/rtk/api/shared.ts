import {
  GetTranslationsRequestModel,
  IBaseRequestModel,
  ITranslationsResponseModel,
  IPrivacyTermsResponseModel
} from 'models';
import { baseApi } from './base';
import { sharedRoutes } from './routes';

export const sharedApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['SaveHomeUi'] })
  .injectEndpoints({
    endpoints: builder => ({
      privacy: builder.query<
        IPrivacyTermsResponseModel,
        IBaseRequestModel
      >({
        query: () => {
          return {
            url: sharedRoutes().privacy,
            method: 'GET',
          };
        },
      }),
      terms: builder.query<
        IPrivacyTermsResponseModel,
        IBaseRequestModel
      >({
        query: () => {
          return {
            url: sharedRoutes().terms,
            method: 'GET',
          };
        },
      }),
      getTranslations: builder.query<
        ITranslationsResponseModel,
        GetTranslationsRequestModel
      >({
        query: ({languageId}) => {
          return {
            url: `${sharedRoutes().getTranslations}?languageId=${languageId}`,
            method: 'GET',
          };
        },
      }),

    }),
    overrideExisting: false,
  });

export const {
  usePrivacyQuery,
  useTermsQuery,
  useGetTranslationsQuery
} = sharedApi;
