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
        IBaseRequestModel & {languageId: string}
      >({
        // The document arrives in the app's language: the server used to return all
        // three at once, so people read theirs after scrolling past the others.
        query: ({languageId}) => {
          return {
            url: `${sharedRoutes().privacy}?languageId=${languageId}`,
            method: 'GET',
          };
        },
      }),
      terms: builder.query<
        IPrivacyTermsResponseModel,
        IBaseRequestModel & {languageId: string}
      >({
        query: ({languageId}) => {
          return {
            url: `${sharedRoutes().terms}?languageId=${languageId}`,
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
