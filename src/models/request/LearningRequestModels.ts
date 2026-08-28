import { IBaseRequestModel } from 'models';
import { MathOperation } from 'models';

export interface IStartMathSessionRequestModel extends IBaseRequestModel {
  operation: MathOperation;
  questionCount?: number;
}

export interface ISubmittedAnswer {
  questionId: string;
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
