import { IDefaultResponseModel } from 'models';

export type MathOperation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division';

export interface IMathCategory {
  categoryKey: string;
  section: 'math';
  operation: MathOperation;
  ageFrom: number;
  ageTo: number;
  maxResult: number;
  questionsPerSession: number;
  answerMaxDigits: number;
  isFree: boolean;
  // Возраст задаёт порядок, а не доступ: категория не по возрасту остаётся
  // открытой, просто уходит ниже.
  suitsAge: boolean;
  starsEarned: number;
  sessionsPlayed: number;
}

export interface IMathCategoriesResponseModel extends IDefaultResponseModel {
  data: IMathCategory[];
}

export interface IMathQuestion {
  questionId: string;
  // Уже собранная строка вида «10 − 2»: у арифметики нет озвученного вопроса,
  // ребёнок читает пример по цифрам и знаку.
  expression: string;
  // Ответ приходит вместе с вопросом, чтобы реакция на «Готово» была мгновенной,
  // без запроса на сервер. Сервер всё равно пересчитывает итог сам.
  correctValue: number;
}

export interface IMathSession {
  sessionId: string;
  operation: MathOperation;
  categoryKey: string;
  answerMaxDigits: number;
  questions: IMathQuestion[];
}

export interface IMathSessionResponseModel extends IDefaultResponseModel {
  data: IMathSession;
}

export interface ISessionAnswerResult {
  questionId: string;
  attempts: number;
  value: number | null;
  status: 'correct' | 'skipped' | 'unanswered';
  firstTry: boolean;
}

export interface ISessionResult {
  stars: number;
  perfect: boolean;
  correctFirstTry: number;
  totalQuestions: number;
  answers?: ISessionAnswerResult[];
  totalStars: number | null;
  starsBalance: number | null;
  alreadyFinished?: boolean;
}

export interface ISessionResultResponseModel extends IDefaultResponseModel {
  data: ISessionResult;
}

export interface ICategoryProgress {
  categoryKey: string;
  source: 'math' | 'cards';
  sessions: number;
  answered: number;
  correctFirstTry: number;
  skipped: number;
  starsEarned: number;
  perfectSessions: number;
  lastPlayedAt: string;
}

export interface ILearningProgress {
  stars: { total: number; balance: number };
  unlockedAvatars: string[];
  unlockedAccents: string[];
  avatarUnlockCost: number;
  accentUnlockCost: number;
  categories: ICategoryProgress[];
}

export interface ILearningProgressResponseModel extends IDefaultResponseModel {
  data: ILearningProgress;
}
