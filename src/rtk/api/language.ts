import { baseApi } from './base';
export type Language = 'en' | 'ru' | 'hy';
export type WordQuestion = {
  id: string;
  image: string;
  audio: string;
  length: number;
  tiles: { id: string; letter: string }[];
  status: 'unanswered' | 'correct' | 'skipped';
  attempts: number;
  word?: string;
};
export type WordSession = {
  sessionId: string;
  status: 'active' | 'finished';
  language: Language;
  questions: WordQuestion[];
  stars: number;
  totalQuestions: number;
  correctFirstTry?: number;
  totalStars?: number;
};
export type LanguageSettings = {
  language: Language;
  minLength: number;
  maxLength: number;
  available?: number;
};
export type WordReport = {
  days: number;
  total: number;
  rows: {
    id: string;
    word: string;
    language: Language;
    status: string;
    attempts: number;
    at: string;
  }[];
};
type Response<T> = { success: boolean; data: T };
const api = baseApi
  .enhanceEndpoints({
    addTagTypes: ['ChildLanguage', 'LearningProgress', 'VideoLock'],
  })
  .injectEndpoints({
    endpoints: b => ({
      startWords: b.mutation<Response<WordSession>, void>({
        query: () => ({ url: '/v1/language/session', method: 'POST' }),
      }),
      answerWord: b.mutation<
        Response<WordSession>,
        {
          sessionId: string;
          questionId: string;
          requestId: string;
          tileIds: string[];
          skip?: boolean;
        }
      >({
        query: ({ sessionId, questionId, ...body }) => ({
          url: `/v1/language/session/${sessionId}/answer/${questionId}`,
          method: 'POST',
          body,
        }),
      }),
      finishWords: b.mutation<Response<WordSession>, string>({
        query: id => ({
          url: `/v1/language/session/${id}/finish`,
          method: 'POST',
        }),
        invalidatesTags: ['LearningProgress', 'VideoLock'],
      }),
      getChildLanguage: b.query<Response<LanguageSettings>, string>({
        query: id => `/v1/language/children/${id}`,
        providesTags: ['ChildLanguage'],
      }),
      saveChildLanguage: b.mutation<
        Response<LanguageSettings>,
        LanguageSettings & { childId: string }
      >({
        query: ({ childId, language, minLength, maxLength }) => ({
          url: `/v1/language/children/${childId}`,
          method: 'PUT',
          body: { language, minLength, maxLength },
        }),
        invalidatesTags: ['ChildLanguage'],
      }),
      getWordsReport: b.query<
        Response<WordReport>,
        { childId: string; skip: number }
      >({
        query: ({ childId, skip }) =>
          `/v1/language/children/${childId}/report?skip=${skip}`,
      }),
    }),
  });
export const {
  useStartWordsMutation,
  useAnswerWordMutation,
  useFinishWordsMutation,
  useGetChildLanguageQuery,
  useSaveChildLanguageMutation,
  useGetWordsReportQuery,
} = api;
