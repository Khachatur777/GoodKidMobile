import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Purchases from 'react-native-purchases';
import { getBuildNumber } from 'react-native-device-info';
import { t } from 'i18next';
import { setItem } from 'configs';
import { applyLanguageForUser, isForceUpdateRequired as forceUpdateRequired } from 'helpers';
import { IConfig, IUser } from 'models';
import {
  holdMainLoader,
  setConfigData,
  setIsLoggedIn,
  setLanguageId,
  setSubscriptionUserData,
  setTokenData,
  setUser,
  showGlobalError,
} from 'rtk';
import { checkUserSubscription } from './usePurchase';

export interface IAuthSessionOptions {
  // Where to go once the sign-in succeeds
  onAuthorized: () => void;
  // Where to go when the server demands an app update
  onForceUpdate: () => void;
}

export interface IAuthTokenData {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * The shared part of signing in, for every way in: email, Google, Apple, a
 * child, and confirming an email after registration.
 *
 * The loader is the point here. A request clears the spinner the moment its
 * response arrives, but signing in does not end there: storing the token,
 * RevenueCat and the move to Home all follow. The spinner used to vanish in the
 * middle of that work, leaving a person looking at the sign-in screen with no
 * idea whether anything was still happening. So the flow takes the loader for
 * itself and releases it only at the very end, successful or not.
 */
export const useAuthSession = ({onAuthorized, onForceUpdate}: IAuthSessionOptions) => {
  const dispatch = useDispatch();
  const versionNumber = getBuildNumber();

  const showAuthError = useCallback(
    (description?: string) => {
      dispatch(
        showGlobalError({
          title: t('global_error_title'),
          description: description || t('global_error_description'),
          isVisible: true,
        }),
      );
    },
    [dispatch],
  );

  const isForceUpdateRequired = useCallback(
    (config?: IConfig) => forceUpdateRequired(Number(versionNumber), config),
    [versionNumber],
  );

  // Purchases belong to the parent. Under a child account we do not sign in to
  // RevenueCat at all: the parent's subscription would go unseen and a purchase
  // would land on the wrong account. A child's status arrives with their card.
  const refreshSubscription = useCallback(
    async (user: IUser) => {
      if (user?.role === 'child') {
        dispatch(setSubscriptionUserData(!!user?.subscription && user.subscription !== 'free'));
        return;
      }

      try {
        // The e-mail and the name used to go here as well. The app is in the
        // Kids category, which forbids handing personal data to a third party,
        // and RevenueCat needs none of it: the account id is enough to find the
        // subscription. Do not put them back.
        await Purchases.setAttributes({
          VersionNumber: String(versionNumber),
          LoginTime: new Date().toString(),
        });
        await Purchases.logIn(String(user.id));

        const userSubscription = await checkUserSubscription();
        dispatch(setSubscriptionUserData(!!userSubscription?.isSubscribed));
      } catch (e) {
        console.warn('RevenueCat error:', e);
      }
    },
    [dispatch, versionNumber],
  );

  const saveAuthToStore = useCallback(
    async (payload: {user: IUser; config?: IConfig; tokenData: IAuthTokenData}) => {
      const {user, config, tokenData} = payload;

      dispatch(setIsLoggedIn(true));
      dispatch(setUser(user));
      // The parent sets the child's language and it arrives in their card
      dispatch(
        setLanguageId(
          user?.role === 'child' ? user?.language : user?.profile?.preferredLanguages,
        ),
      );

      // ...и должен дойти до интерфейса, а не остаться в сторе. Родителю при
      // этом возвращается его собственный язык: он выбирал его сам.
      await applyLanguageForUser(user);
      dispatch(setConfigData(config as any));

      dispatch(
        setTokenData({
          accessToken: tokenData?.accessToken as any,
          expiresIn: tokenData?.expiresIn as any,
          refreshToken: tokenData?.refreshToken as any,
        }),
      );

      await setItem('tokenData', {
        accessToken: tokenData?.accessToken,
        expiresIn: tokenData?.expiresIn,
        refreshToken: tokenData?.refreshToken,
      });

      // The subscription refreshes in the background: the RevenueCat round-trip
      // takes seconds, and nobody should wait them out on the sign-in screen.
      refreshSubscription(user).catch(() => {});

      // The filter is no longer tied to an account: it lives with the child, and
      // the server applies it whatever the client sends.
    },
    [dispatch, refreshSubscription],
  );

  /**
   * Finishes signing in from the server's response. Returns true when the person
   * was taken somewhere: on false the caller shows an error.
   */
  const finalizeAuth = useCallback(
    async (responseData?: any) => {
      const config = responseData?.data?.config;

      if (isForceUpdateRequired(config)) {
        onForceUpdate();
        return true;
      }

      const user = responseData?.data?.user;
      if (!user) return false;

      await saveAuthToStore({
        user,
        config,
        tokenData: {
          accessToken: responseData?.data?.accessToken,
          refreshToken: responseData?.data?.refreshToken,
          expiresIn: responseData?.data?.expiresIn,
        },
      });

      onAuthorized();
      return true;
    },
    [isForceUpdateRequired, onAuthorized, onForceUpdate, saveAuthToStore],
  );

  /**
   * Holds the loader for the whole sign-in flow. A flow returns false, or
   * nothing, when it could not finish — then we show an error so the screen does
   * not freeze in silence. Returning `'silent'` ends it without a message: that
   * is how cancelling the Google or Apple sheet arrives.
   */
  const runAuthFlow = useCallback(
    async (flow: () => Promise<boolean | 'silent' | void>) => {
      dispatch(holdMainLoader(true));

      try {
        const result = await flow();
        if (result === 'silent') return;
        if (!result) showAuthError();
      } catch (e) {
        console.log(e);
        showAuthError();
      } finally {
        dispatch(holdMainLoader(false));
      }
    },
    [dispatch, showAuthError],
  );

  return {finalizeAuth, runAuthFlow, saveAuthToStore, showAuthError, isForceUpdateRequired};
};

export default useAuthSession;
