import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateFromRoot(name: string, params?: object) {
  if (navigationRef.isReady()) {
    /* @ts-ignore */
    navigationRef.navigate(name, params);
  }
}

// Reset to the sign-in screen: there is no guest mode after signing out, and
// with no role there is nothing to see — feed, Learn and filter need an account.
export function resetToSignIn() {
  if (navigationRef.isReady()) {
    // The nested stack needs a state, not params: with params it opened on its
    // own first screen (Splash) instead of sign-in.
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
