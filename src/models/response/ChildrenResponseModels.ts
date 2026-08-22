import { IDefaultResponseModel } from './AuthResponseModels';

export interface IChild {
  id: string;
  role: 'child';
  parentId: string;
  name: string;
  age: number;
  // Ключ пресета из набора аватарок, файлов не храним
  avatar: string;
  login: string;
  language: string;
  appearance?: {
    accent?: string | null;
    themeMode?: 'light' | 'dark' | 'system';
  };
  // Наследуется от родителя, своей подписки у ребёнка нет
  subscription?: string;
}

export interface IChildLimits {
  maxChildren: number;
  activityDays: number;
}

export interface IChildrenResponseModel extends IDefaultResponseModel {
  data?: {
    children: IChild[];
    limits: IChildLimits;
  };
}

export interface IChildResponseModel extends IDefaultResponseModel {
  data?: IChild;
}

export interface IChildFilter {
  categories: number[];
  language: string | null;
  age: number | null;
}

export interface IChildFilterResponseModel extends IDefaultResponseModel {
  filter?: IChildFilter;
}

export interface IChildActivityItem {
  id: string;
  type: 'video' | 'learn';
  itemId: string;
  categoryId: string | null;
  title: string | null;
  thumbnail: string | null;
  durationSeconds: number | null;
  watchedSeconds: number;
  startedAt: string;
  lastSeenAt: string;
}

export interface IChildActivityResponseModel extends IDefaultResponseModel {
  data?: {
    // Глубину показа задаёт сервер, шапка рисует то, что пришло
    days: number;
    items: IChildActivityItem[];
  };
}
