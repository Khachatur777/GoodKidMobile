import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import Purchases from 'react-native-purchases';
import { getBuildNumber } from 'react-native-device-info';
import { t } from 'i18next';
import { setItem } from 'configs';
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
  // Куда вести, когда вход состоялся
  onAuthorized: () => void;
  // Куда вести, если сервер требует обновить приложение
  onForceUpdate: () => void;
}

export interface IAuthTokenData {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

/**
 * Общая часть входа для всех способов: почта, Google, Apple, ребёнок и
 * подтверждение почты после регистрации.
 *
 * Главное здесь — лоадер. Запрос гасит спиннер, как только пришёл ответ, а
 * вход на этом не заканчивается: дальше идут запись токена, RevenueCat и
 * переход на Home. Раньше спиннер пропадал посреди этой работы, и человек
 * оставался смотреть на экран входа, не понимая, идёт что-то или уже нет.
 * Поэтому сценарий целиком берёт лоадер на себя и отпускает его только в
 * самом конце — успешном или нет.
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
    (config?: IConfig) =>
      !!config?.forceUpdate &&
      `${versionNumber}` !==
        `${Platform.OS === 'android' ? config?.versionAppAndroid : config?.versionAppIos}`,
    [versionNumber],
  );

  // Покупки принадлежат родителю. Под детским аккаунтом RevenueCat не логиним
  // вовсе: иначе подписка родителя не увидится, а покупка уехала бы не на тот
  // аккаунт. Ребёнку статус приходит с сервера вместе с карточкой.
  const refreshSubscription = useCallback(
    async (user: IUser) => {
      if (user?.role === 'child') {
        dispatch(setSubscriptionUserData(!!user?.subscription && user.subscription !== 'free'));
        return;
      }

      try {
        await Purchases.setAttributes({
          'E-mail': user?.email || '',
          'Name': `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim(),
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
      // Язык ребёнка задаёт родитель и он приходит в его карточке
      dispatch(
        setLanguageId(
          user?.role === 'child' ? user?.language : user?.profile?.preferredLanguages,
        ),
      );
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

      // Подписку обновляем в фоне: поход в RevenueCat занимает секунды, и
      // держать на его время человека на экране входа незачем.
      refreshSubscription(user).catch(() => {});

      // Фильтр к аккаунту больше не привязан: он живёт у ребёнка, и сервер
      // применяет его сам, что бы ни прислал клиент.
    },
    [dispatch, refreshSubscription],
  );

  /**
   * Доводит вход до конца по ответу сервера. Возвращает true, если человека
   * куда-то увели: по false вызывающий показывает ошибку.
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
   * Держит лоадер на весь сценарий входа. Сценарий возвращает false или
   * ничего, если довести до конца не вышло, — тогда показываем ошибку, чтобы
   * экран не замирал молча. Вернувший `'silent'` обрывается без сообщения:
   * так уходит отмена системного окна Google или Apple.
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
