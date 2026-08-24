import { IDefaultResponseModel } from './AuthResponseModels';

export interface IChild {
  id: string;
  role: 'child';
  parentId: string;
  name: string;
  age: number;
  // The preset key from the avatar set; no files are stored
  avatar: string;
  login: string;
  language: string;
  appearance?: {
    accent?: string | null;
    themeMode?: 'light' | 'dark' | 'system';
  };
  // Inherited from the parent — a child has no subscription of their own
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
    // The server sets how deep history goes; the header shows what arrived
    days: number;
    items: IChildActivityItem[];
  };
}
