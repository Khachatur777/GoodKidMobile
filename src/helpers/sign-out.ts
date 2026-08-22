import {createStore} from 'rtk/store';
import { removeItem } from 'configs';
import { setIsLoggedIn, setLanguageId, setTokenData, setUser } from 'rtk';
import Purchases from "react-native-purchases";
import {signOutGoogle} from "hooks";
import {resetToSignIn} from './root-navigation';

export const signOut = async () => {
  // Роль нужна до очистки: под детским аккаунтом мы в RevenueCat не входили,
  // и звать logOut там не за чем — он только ругается в консоль.
  const wasParent = createStore.getState()?.shared?.user?.role !== 'child';

  createStore.dispatch(setIsLoggedIn(false));
  createStore.dispatch(setUser(null));
  createStore.dispatch(setLanguageId(null));
  createStore.dispatch(setTokenData(null));

  // Google и RevenueCat могут бросить: из Google мы могли не входить вовсе,
  // а под детским аккаунтом в RevenueCat не логинимся принципиально. Раньше
  // это роняло весь выход — токен оставался в хранилище, и сессия возвращалась
  // после перезапуска.
  try {
    await signOutGoogle();
  } catch (e) {
    console.log('signOutGoogle skipped:', e);
  }

  if (wasParent) {
    try {
      await Purchases.logOut();
    } catch (e) {
      console.log('Purchases.logOut skipped:', e);
    }
  }

  await removeItem('tokenData');

  // Возвращаем на вход: гостевого режима нет, без роли смотреть нечего
  resetToSignIn();
};
