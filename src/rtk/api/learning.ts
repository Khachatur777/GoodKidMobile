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
  ICardCategoriesRequestModel,
  ICardCategoriesResponseModel,
  IStartCardSessionRequestModel,
  ICardSessionResponseModel,
  ICompleteCategoryRequestModel,
  ICompleteCategoryResponseModel,
  ILearningReportRequestModel,
  ILearningReportResponseModel,
  IChildMathRequestModel,
  IChildMathResponseModel,
  IChildMathUpdateRequestModel,
  IChildMathPreviewResponseModel,
  IReportQuestionsRequestModel,
  IReportQuestionsResponseModel,
} from 'models';
import { baseApi } from './base';
import { learningRoutes } from './routes';

export const learningApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['LearningProgress', 'ChildMath'] })
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
      // Звёзды за операцию показываются здесь же, значит список должен
      // обновляться после сессии — как обновляются категории познания.
      providesTags: ['LearningProgress'],
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
    getCardCategories: builder.query<
      ICardCategoriesResponseModel,
      ICardCategoriesRequestModel
    >({
      query: ({ section = 'world' }) => ({
        url: `${learningRoutes().cardCategories}?section=${section}`,
        method: 'GET',
      }),
      providesTags: ['LearningProgress'],
    }),
    startCardSession: builder.mutation<
      ICardSessionResponseModel,
      IStartCardSessionRequestModel
    >({
      query: ({ categoryId, limit }) => ({
        url: learningRoutes().cardSession,
        method: 'POST',
        body: { categoryId, limit },
      }),
    }),
    completeCategory: builder.mutation<
      ICompleteCategoryResponseModel,
      ICompleteCategoryRequestModel
    >({
      query: ({ categoryId, cardIds }) => ({
        url: learningRoutes().completeCategory,
        method: 'POST',
        body: { categoryId, cardIds },
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
    getLearningReport: builder.query<
      ILearningReportResponseModel,
      ILearningReportRequestModel
    >({
      query: ({ childId }) => ({
        url: learningRoutes().report(childId),
        method: 'GET',
      }),
    }),
    // Последние задачи одной категории. Отдельным запросом, а не вместе с
    // отчётом: список нужен, только когда родитель открыл модал.
    getReportQuestions: builder.query<
      IReportQuestionsResponseModel,
      IReportQuestionsRequestModel
    >({
      query: ({ childId, operation, limit }) => ({
        url: learningRoutes().reportQuestions(childId),
        method: 'GET',
        params: { ...(operation ? { operation } : {}), ...(limit ? { limit } : {}) },
      }),
    }),
    getChildMath: builder.query<IChildMathResponseModel, IChildMathRequestModel>({
      query: ({ childId }) => ({
        url: learningRoutes().childMath(childId),
        method: 'GET',
      }),
      providesTags: ['ChildMath'],
    }),
    updateChildMath: builder.mutation<
      IChildMathResponseModel,
      IChildMathUpdateRequestModel
    >({
      query: ({ childId, operation, ...values }) => ({
        url: learningRoutes().childMathOperation(childId, operation),
        method: 'PUT',
        body: values,
      }),
      invalidatesTags: ['ChildMath'],
    }),
    resetChildMath: builder.mutation<
      IChildMathResponseModel,
      IChildMathUpdateRequestModel
    >({
      query: ({ childId, operation }) => ({
        url: learningRoutes().childMathOperation(childId, operation),
        method: 'DELETE',
      }),
      invalidatesTags: ['ChildMath'],
    }),
    // Черновик: что дадут эти числа, пока их ещё не сохранили.
    previewChildMath: builder.mutation<
      IChildMathPreviewResponseModel,
      IChildMathUpdateRequestModel
    >({
      query: ({ childId, operation, ...values }) => ({
        url: learningRoutes().childMathPreview(childId, operation),
        method: 'POST',
        body: values,
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
  useGetCardCategoriesQuery,
  useStartCardSessionMutation,
  useCompleteCategoryMutation,
  useGetLearningReportQuery,
  useGetReportQuestionsQuery,
  useGetChildMathQuery,
  useUpdateChildMathMutation,
  useResetChildMathMutation,
  usePreviewChildMathMutation,
} = learningApi;
