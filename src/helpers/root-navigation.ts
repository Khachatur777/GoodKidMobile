import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateFromRoot(name: string, params?: object) {
  if (navigationRef.isReady()) {
    /* @ts-ignore */
    navigationRef.navigate(name, params);
  }
}

// Сброс на экран входа: после выхода гостевого режима нет, и без роли внутри
// приложения смотреть нечего — лента, Learn и фильтр требуют аккаунта.
export function resetToSignIn() {
  if (navigationRef.isReady()) {
    // Вложенному стеку нужно именно состояние: с params он открывался на своём
    // первом экране (Splash), а не на входе.
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: 'AuthNavigation',
          state: {index: 0, routes: [{name: 'SignIn'}]},
        },
      ],
    });
  }
}
