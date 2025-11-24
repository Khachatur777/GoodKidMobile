import {createStackNavigator} from '@react-navigation/stack';
import {AuthNavigation} from './auth';
import {TabNavigator} from './tabs';
import {useGetTranslations} from "hooks";
import {isLoggedInSelector} from "rtk";
import {useSelector} from "react-redux";

const RootStack = createStackNavigator();

export const RootNavigator = () => {
  const {isTranslationsLoaded} = useGetTranslations();
  const isLoggedIn = useSelector(isLoggedInSelector);


  // if (isLoggedIn === null || !isTranslationsLoaded) {
  //   // Render a loading indicator while checking user state
  //   return (
  //     // TODO: ----> CREATE NEW PRELOADER <----
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <Spinner size="large" />
  //     </View>
  //   );
  // }

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="AuthNavigation" component={AuthNavigation} />

      <RootStack.Screen
        name="TabScreens"
        component={TabNavigator}
        options={{
          gestureEnabled: false,
        }}
      />
    </RootStack.Navigator>
  );
};
