import { IBaseRequestModel } from 'models';

export interface IFilterEditRequestModel extends IBaseRequestModel {
  categories: number[];
  age: number | string;
  language: string;

}


