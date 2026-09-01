import { IDefaultResponseModel } from 'models';

// open — выдана, ребёнок ещё не отмечал; pending — отметил, ждёт родителя;
// done — родитель подтвердил и звёзды начислены.
export type TaskStatus = 'open' | 'pending' | 'done' | 'cancelled';

export interface ITask {
  _id: string;
  childId: string;
  parentId: string;
  title: string;
  description: string;
  // Эмодзи-метка: набор иконок приложения не покрывает бытовые дела, а список
  // нужно опознавать не читая. Пустая строка — рисуем общий значок задач.
  icon: string;
  // Сколько задача стоит сейчас. Родитель может это поменять, пока она открыта.
  stars: number;
  status: TaskStatus;
  // Сколько на самом деле начислено при закрытии. Хранится отдельно от stars,
  // чтобы правка цены задним числом не переписывала заработанное.
  awardedStars: number | null;
  submittedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Детский экран получает сразу три группы — ровно так они и рисуются.
export interface IMyTasksResponseModel extends IDefaultResponseModel {
  data: {
    open: ITask[];
    pending: ITask[];
    done: ITask[];
  };
}

export interface ITaskListResponseModel extends IDefaultResponseModel {
  data: { tasks: ITask[] };
}

export interface ITaskResponseModel extends IDefaultResponseModel {
  data: { task: ITask };
}

// alreadySubmitted и alreadyClosed — не ошибки: так отвечает второе нажатие
// при плохой связи. Экран показывает результат, а не сообщение о сбое.
export interface ISubmitTaskResponseModel extends IDefaultResponseModel {
  data: { task: ITask; alreadySubmitted: boolean };
}

export interface IApproveTaskResponseModel extends IDefaultResponseModel {
  data: {
    task: ITask;
    stars: { total: number; balance: number } | null;
    alreadyClosed: boolean;
  };
}

export interface ITaskTemplate {
  _id: string;
  parentId: string;
  title: string;
  description: string;
  stars: number;
  icon: string;
  // Сколько раз шаблон выдавали — единственный признак того, какие дела
  // действительно вошли в быт.
  usageCount: number;
  createdAt: string;
}

export interface ITaskTemplatesResponseModel extends IDefaultResponseModel {
  data: { templates: ITaskTemplate[] };
}

export interface ITaskTemplateResponseModel extends IDefaultResponseModel {
  data: { template: ITaskTemplate };
}

export interface IPendingCountResponseModel extends IDefaultResponseModel {
  data: {
    // Общее число — для бейджа на табе, разбивка — для карточек детей.
    count: number;
    byChild: Record<string, number>;
  };
}
