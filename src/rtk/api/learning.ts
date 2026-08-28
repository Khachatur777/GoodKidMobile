import {
  IBaseRequestModel,
  IFinishSessionRequestModel,
  ILearningProgressResponseModel,
  IMathCategoriesResponseModel,
  IMathSessionResponseModel,
  ISessionResultResponseModel,
  IStartMathSessionRequestModel,
  IUnlockAppearanceRequestModel,
  IUnlockResponseModel,
} from 'models';
import { baseApi } from './base';
import { learningRoutes } from './routes';

export const learningApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['LearningProgress'] })
  .injectEndpoints({
  endpoints: builder => ({
    getMathCategories: builder.query<
      IMathCategoriesResponseModel,
      IBaseRequestModel
    >({
      query: () => ({
        url: learningRoutes().mathCategories,
        method: 'GET',
      }),
    }),
    // Вся сессия приходит одним запросом. Выдача по вопросу означала бы, что
    // обрыв связи на середине стоит ребёнку уже заработанных звёзд.
    startMathSession: builder.mutation<
      IMathSessionResponseModel,
      IStartMathSessionRequestModel
    >({
      query: ({ operation, questionCount }) => ({
        url: learningRoutes().mathSession,
        method: 'POST',
        body: { operation, questionCount },
      }),
    }),
    finishSession: builder.mutation<
      ISessionResultResponseModel,
      IFinishSessionRequestModel
    >({
      query: ({ sessionId, answers }) => ({
        url: learningRoutes().finishSession(sessionId),
        method: 'POST',
        body: { answers },
      }),
      invalidatesTags: ['LearningProgress'],
    }),
    unlockAppearance: builder.mutation<
      IUnlockResponseModel,
      IUnlockAppearanceRequestModel
    >({
      query: ({ type, id }) => ({
        url: learningRoutes().unlock,
        method: 'POST',
        body: { type, id },
      }),
      invalidatesTags: ['LearningProgress'],
    }),
    getLearningProgress: builder.query<
      ILearningProgressResponseModel,
      IBaseRequestModel
    >({
      query: () => ({
        url: learningRoutes().progress,
        method: 'GET',
      }),
      providesTags: ['LearningProgress'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMathCategoriesQuery,
  useStartMathSessionMutation,
  useFinishSessionMutation,
  useGetLearningProgressQuery,
  useUnlockAppearanceMutation,
} = learningApi;
