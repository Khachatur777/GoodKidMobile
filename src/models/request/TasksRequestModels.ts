import { IBaseRequestModel, TaskStatus } from 'models';

export interface IChildTasksRequestModel extends IBaseRequestModel {
  id: string;
  status?: TaskStatus;
}

// Либо задача набирается руками, либо берётся из шаблона — поэтому title и
// stars необязательны: при templateId их подставит сервер.
export interface ICreateTaskRequestModel extends IBaseRequestModel {
  id: string;
  title?: string;
  description?: string;
  stars?: number;
  icon?: string;
  templateId?: string;
  saveAsTemplate?: boolean;
}

export interface IUpdateTaskRequestModel extends IBaseRequestModel {
  id: string;
  taskId: string;
  title?: string;
  description?: string;
  stars?: number;
  icon?: string;
}

export interface ITaskActionRequestModel extends IBaseRequestModel {
  id: string;
  taskId: string;
}

export interface ISubmitTaskRequestModel extends IBaseRequestModel {
  taskId: string;
}

export interface ICreateTemplateRequestModel extends IBaseRequestModel {
  title: string;
  description?: string;
  stars: number;
  icon?: string;
}

export interface IDeleteTemplateRequestModel extends IBaseRequestModel {
  templateId: string;
}
