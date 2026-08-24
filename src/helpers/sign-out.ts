import {createStore} from 'rtk/store';
import { removeItem } from 'configs';
import { setIsLoggedIn, setLanguageId, setTokenData, setUser } from 'rtk';
import Purchases from "react-native-purchases";
import {signOutGoogle} from "hooks";
import {resetToSignIn} from './root-navigation';

export const signOut = async () => {
  // The role is needed before the state is cleared: under a child account we
  // never signed in to RevenueCat, so calling logOut there only logs a complaint.
  const wasParent = createStore.getState()?.shared?.user?.role !== 'child';

  // Go to the sign-in screen first and clear the state after: otherwise the
  // current screen repaints as signed-out first, and that reads as a flicker.
  resetToSignIn();

  createStore.dispatch(setIsLoggedIn(false));
  createStore.dispatch(setUser(null));
  createStore.dispatch(setLanguageId(null));
  createStore.dispatch(setTokenData(null));

  // Google and RevenueCat can throw: we may never have signed in with Google,
  // and under a child account we deliberately do not sign in to RevenueCat. This
  // used to break the whole sign-out — the token stayed in storage and the
  // session came back after a restart.
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
};
