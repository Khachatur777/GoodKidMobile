import {
  IBaseRequestModel,
  IFinishSessionRequestModel,
  ILearningProgressResponseModel,
  IMathCategoriesResponseModel,
  IMathSessionResponseModel,
  ISessionResultResponseModel,
  IStartMathSessionRequestModel,
} from 'models';
import { baseApi } from './base';
import { learningRoutes } from './routes';

export const learningApi = baseApi.injectEndpoints({
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
    }),
    getLearningProgress: builder.query<
      ILearningProgressResponseModel,
      IBaseRequestModel
    >({
      query: () => ({
        url: learningRoutes().progress,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMathCategoriesQuery,
  useStartMathSessionMutation,
  useFinishSessionMutation,
  useGetLearningProgressQuery,
} = learningApi;
