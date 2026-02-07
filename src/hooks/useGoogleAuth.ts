import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {googleIosClientId, googleWebClientId} from "configs";
import {Alert} from "react-native";

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: googleWebClientId,
    iosClientId: googleIosClientId,
    offlineAccess: true
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();

    return { userInfo, tokens };
  } catch (error: any) {
    Alert.alert(error?.message || error);

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
