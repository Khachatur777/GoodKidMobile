
import {createStore} from 'rtk/store';
import { removeItem } from 'configs';
import { setIsLoggedIn, setLanguageId, setTokenData, setUser } from 'rtk';
import Purchases from "react-native-purchases";

export const signOut = async () => {
  // Clear local storage
  createStore.dispatch(setIsLoggedIn(false));
  createStore.dispatch(setUser(null));
  createStore.dispatch(setLanguageId(null));
  createStore.dispatch(setTokenData(null));
  await Purchases.logOut();
  await removeItem('tokenData')
};
