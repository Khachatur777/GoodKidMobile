import { IBaseRequestModel } from 'models';
import { MathOperation } from 'models';

export interface IStartMathSessionRequestModel extends IBaseRequestModel {
  operation: MathOperation;
  questionCount?: number;
}

export interface ISubmittedAnswer {
  questionId: string;
  // Карточка из админки отвечается id варианта, арифметика — числом.
  answerId?: string | null;
  // null — ребёнок дошёл до вопроса и ушёл, не решив. Это не то же самое, что
  // вопрос, до которого он не добрался.
  value?: number | null;
  attempts?: number;
}

export interface IFinishSessionRequestModel extends IBaseRequestModel {
  sessionId: string;
  answers: ISubmittedAnswer[];
}

export interface IUnlockAppearanceRequestModel extends IBaseRequestModel {
  type: 'avatar' | 'accent';
  id: string;
}

export interface ICardCategoriesRequestModel extends IBaseRequestModel {
  section?: string;
}

export interface IStartCardSessionRequestModel extends IBaseRequestModel {
  categoryId: string;
  limit?: number;
}

export interface ICompleteCategoryRequestModel extends IBaseRequestModel {
  categoryId: string;
  // Карточки пройденной сессии: сервер отмечает их просмотренными, чтобы
  // следующий заход отдал следующие, а не те же самые.
  cardIds?: string[];
}

export interface ILearningReportRequestModel extends IBaseRequestModel {
  childId: string;
}
