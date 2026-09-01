import { IBaseRequestModel } from 'models';

export interface IChildVideoLockRequestModel extends IBaseRequestModel {
  id: string;
}

export interface IUpdateVideoLockRequestModel extends IBaseRequestModel {
  id: string;
  enabled?: boolean;
  unlockCost?: number;
}
