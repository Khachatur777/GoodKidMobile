import { IBaseRequestModel } from 'models';

export interface IFilterEditRequestModel extends IBaseRequestModel {
  categories: number[];
  age: number | string;
  // Several languages: empty means every language, as with categories
  language: string[];

}


