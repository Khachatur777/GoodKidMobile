import { IBaseRequestModel } from 'models';

export interface ILearnCategoryItemsRequestModel extends IBaseRequestModel {
  categoryId: string;
  limit: number;
}


export interface IViewLearnItemsRequestModel extends IBaseRequestModel {
  knowledgeItemId: string;
}


