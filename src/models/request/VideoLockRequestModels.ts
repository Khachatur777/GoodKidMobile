import { IBaseRequestModel } from 'models';

export interface IChildVideoLockRequestModel extends IBaseRequestModel {
  id: string;
}

export interface IUpdateVideoLockRequestModel extends IBaseRequestModel {
  id: string;
  enabled?: boolean;
  unlockCost?: number;
  // На сколько часов открывается видео после оплаты, 1–48. Не отправляли —
  // ребёнок остаётся на значении из консоли.
  unlockHours?: number;
}
