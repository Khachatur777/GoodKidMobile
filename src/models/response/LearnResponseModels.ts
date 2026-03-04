import { IDefaultResponseModel } from 'models';

export interface ILearnCategoryItem {
  _id: string;
  name: string;
  image: string;
  type: number;
}

export interface ILearnCategory extends IDefaultResponseModel {
  categories: ILearnCategoryItem[];
}

export interface ILearnCategoryItems {
  _id: string;
  id: string;
  categoryId: string;
  title: {
    ru: string;
    en: string;
    hy: string;
  };
  audio: {
    ru: { path: string; voice: string; format: string };
    en: { path: string; voice: string; format: string };
    hy: { path: string; voice: string; format: string };
  };
  description: {
    ru: string;
    en: string;
    hy: string;
  };
  images: {
    type: string;
    path: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ILearnCategoryItemsResponseModel extends IDefaultResponseModel {
  data: ILearnCategoryItems[];
}
