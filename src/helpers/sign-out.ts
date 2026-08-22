
import {createStore} from 'rtk/store';
import { removeItem } from 'configs';
import { setIsLoggedIn, setLanguageId, setTokenData, setUser } from 'rtk';
import Purchases from "react-native-purchases";
import {signOutGoogle} from "hooks";
import {resetToSignIn} from './root-navigation';

export const signOut = async () => {
  // Clear local storage
  createStore.dispatch(setIsLoggedIn(false));
  createStore.dispatch(setUser(null));
  createStore.dispatch(setLanguageId(null));
  createStore.dispatch(setTokenData(null));
  await signOutGoogle()
  await Purchases.logOut();
  await removeItem('tokenData')

  // Возвращаем на вход, иначе человек остаётся в табах с пустыми экранами
  resetToSignIn();
};
