import { IDefaultResponseModel } from 'models';

export interface IVideoLockState {
  // Включил ли родитель блокировку вообще.
  enabled: boolean;
  // Закрыто ли прямо сейчас: включено И оплаченное окно не идёт.
  locked: boolean;
  unlockCost: number;
  // Докуда открыто. null — не оплачивалось или срок вышел.
  unlockedUntil: string | null;
  balance: number;
  // Сколько звёзд не хватает. 0 — хватает.
  needed: number;
  unlockHours: number;
}

export interface IVideoLockResponseModel extends IDefaultResponseModel {
  data: IVideoLockState;
}

// alreadyOpen — не ошибка: так отвечает второе нажатие при плохой связи.
export interface IVideoUnlockResponseModel extends IDefaultResponseModel {
  data: IVideoLockState & { spent: number; alreadyOpen: boolean };
}
