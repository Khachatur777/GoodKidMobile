import { IDefaultResponseModel } from 'models';

export interface IPrivacyTermsResponseModel extends IDefaultResponseModel{
  text: string
}

export interface ITranslationsResponseModel extends IDefaultResponseModel{
  values: [key: string]
  languageId: string
}


