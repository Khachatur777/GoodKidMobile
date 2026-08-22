import { IBaseRequestModel } from 'models';

export interface ISignInChildRequestModel extends IBaseRequestModel {
  login: string;
  password: string;
}

export interface ICreateChildRequestModel extends IBaseRequestModel {
  name: string;
  age: number;
  avatar?: string;
  language?: string;
  login: string;
  password: string;
}

export interface IUpdateChildRequestModel extends IBaseRequestModel {
  id: string;
  name?: string;
  age?: number;
  avatar?: string;
  language?: string;
  login?: string;
}

export interface IChangeChildPasswordRequestModel extends IBaseRequestModel {
  id: string;
  password: string;
}

export interface IChildFilterRequestModel extends IBaseRequestModel {
  id: string;
  categories: number[];
  language: string | null;
  age: number | null;
}

export interface IChildActivityRequestModel extends IBaseRequestModel {
  id: string;
  days?: number;
  type?: 'video' | 'learn';
}

export interface IVideoActivityRequestModel extends IBaseRequestModel {
  videoId: string;
  watchedSeconds?: number;
}
