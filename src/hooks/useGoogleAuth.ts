import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {googleIosClientId, googleWebClientId} from "configs";

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '408052597809-qke5e8fa9o9dq8jp5cclhsevktmphbfr.apps.googleusercontent.com',
    iosClientId: '408052597809-pthnlhj5rd8qu443nuf815q7cvnsdacg.apps.googleusercontent.com',
    scopes: [
      /* what APIs you want to access on behalf of the user, default is email and profile
      this is just an example, most likely you don't need this option at all! */
      'https://www.googleapis.com/auth/drive.readonly',
    ],
    offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();

    console.log('userInfo', userInfo);
    console.log('tokens', tokens);

    return { userInfo, tokens };
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('User cancelled sign in');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('Sign in in progress');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('Play services not available');
    } else {
      console.log('Google sign in error', error);
    }
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (e) {
    console.log('Error while sign out', e);
  }
};
