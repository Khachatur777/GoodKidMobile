import { IBaseRequestModel } from 'models';

export interface IGetVideoRequestModel extends IBaseRequestModel {
  categories?: number[];
  language?: string;
  age?: number;
  cursor?: string;
  limit?: number;
  exceptVideoId?: string;
  search?: string;
}

export interface IGetVideoSearchTitleRequestModel extends IBaseRequestModel {
  search: string
}


