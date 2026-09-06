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
  // Родитель закрыл эту операцию этому ребёнку. Плитка остаётся на экране с
  // замком: исчезнувшая плитка выглядит как поломка, а замок — как решение,
  // о котором можно спросить.
  locked: boolean;
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
  // null — режим просмотра: родитель смотрит содержимое, занятие не
  // засчитывается и звёзды не начисляются.
  sessionId: string | null;
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
  // Просмотровая категория: отвечать было нечего, и «с первой попытки» про неё
  // сказать нельзя — там считаются просмотренные карточки.
  viewOnly?: boolean;
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

export interface IUnlockResult {
  spent?: number;
  alreadyUnlocked?: boolean;
  stars: { total: number; balance: number };
  unlocked: string[];
}

export interface IUnlockResponseModel extends IDefaultResponseModel {
  data: IUnlockResult;
}

export type CardType = 'learn' | 'multiple_choice' | 'count' | 'numeric_input';

export interface ILocalized {
  ru: string;
  en: string;
  hy: string;
}

export interface IAudioTrack {
  path: string;
  voice: string;
  format: string;
}

export type ILocalizedAudio = Partial<Record<'ru' | 'en' | 'hy', IAudioTrack>>;

export interface ICardAnswer {
  id: string;
  emoji?: string;
  imagePath?: string;
  label?: ILocalized;
  isCorrect?: boolean;
}

export interface ILearningCard {
  id: string;
  type: CardType;
  title: ILocalized;
  description: ILocalized;
  question?: ILocalized;
  audio?: ILocalizedAudio;
  questionAudio?: ILocalizedAudio;
  images?: { type: string; path: string }[];
  visual?: { emoji: string; repeat: number };
  answers?: ICardAnswer[];
}

export interface ICardCategory {
  categoryKey: string;
  section: string;
  name: string;
  image: string;
  ageFrom: number;
  ageTo: number;
  isFree: boolean;
  suitsAge: boolean;
  cardsTotal: number;
  starsEarned: number;
  sessionsPlayed: number;
}

export interface ICardCategoriesResponseModel extends IDefaultResponseModel {
  data: ICardCategory[];
}

export interface ICardSession {
  sessionId: string | null;
  categoryKey: string;
  cards: ILearningCard[];
}

export interface ICardSessionResponseModel extends IDefaultResponseModel {
  data: ICardSession;
}

export interface ICompleteCategoryResult {
  stars: number;
  alreadyRewarded?: boolean;
  totalStars?: number | null;
  starsBalance?: number | null;
}

export interface ICompleteCategoryResponseModel extends IDefaultResponseModel {
  data: ICompleteCategoryResult;
}

export interface IReportCategory {
  categoryKey: string;
  // Ключ перевода для категорий из админки; у арифметики его нет — её названия
  // приложение знает само.
  nameKey?: string | null;
  source: 'math' | 'cards';
  sessions: number;
  answered: number;
  correctFirstTry: number;
  // Пропущенные — главный сигнал для родителя: не «не знает», а «слишком
  // сложно». Поэтому лежат отдельно от неверных.
  skipped: number;
  averageAttempts: number;
  starsEarned: number;
  perfectSessions: number;
  lastPlayedAt: string;
}

// Одна задача из последних, что решал ребёнок. Промежуточных попыток нет —
// сохраняется только последний ответ и их число.
export interface IReportQuestion {
  operation: MathOperation;
  // Готовая строка примера: «7 × 5».
  expression: string;
  correctValue: number;
  // Что ребёнок оставил в поле; null у тех, кого он не решил и не тронул.
  value: number | null;
  attempts: number;
  // 'correct' — решил, 'skipped' — пробовал и ушёл, не решив.
  status: 'correct' | 'skipped';
  firstTry: boolean;
  at: string;
}

export interface IReportQuestionsResponseModel extends IDefaultResponseModel {
  data: {
    questions: IReportQuestion[];
    // За сколько дней собран список — столько же, сколько показывает «Активность».
    days: number;
  };
}

export interface ILearningReport {
  child: {
    id: string;
    name: string;
    age: number;
    stars: { total: number; balance: number };
  };
  categories: IReportCategory[];
  // Едут вместе с отчётом, чтобы страница ребёнка собиралась одним запросом:
  // без общего числа категорий «12 пройдено» не с чем сравнить.
  totals?: { cardCategories: number };
  lastActivityAt?: string | null;
}

export interface ILearningReportResponseModel extends IDefaultResponseModel {
  data: ILearningReport;
}

export interface IChildMathRule {
  operation: MathOperation;
  // Переключатель родителя: открыта ли операция этому ребёнку. Выключенные в
  // консоли операции сюда вообще не приходят.
  enabled: boolean;
  minOperand: number;
  maxOperand: number;
  maxResult: number;
  // Родитель менял эти числа или они пришли из умолчаний.
  customised: boolean;
  // Сколько разных примеров дают эти настройки и сколько нужно на сессию.
  variants: number;
  requiredVariants: number;
  ageFrom: number;
  ageTo: number;
  questionsPerSession: number;
}

export interface IChildMathResponseModel extends IDefaultResponseModel {
  data: IChildMathRule[];
}

export interface IChildMathPreview {
  ok: boolean;
  reason: string | null;
  variants: number;
  required: number;
  examples: { expression: string; correctValue: number }[];
}

export interface IChildMathPreviewResponseModel extends IDefaultResponseModel {
  data: IChildMathPreview;
}
