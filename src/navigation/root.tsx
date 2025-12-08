import {createStackNavigator} from '@react-navigation/stack';
import {AuthNavigation} from './auth';
import {TabNavigator} from './tabs';
import {useGetTranslations} from "hooks";

const RootStack = createStackNavigator();

export const RootNavigator = () => {
  const {isTranslationsLoaded} = useGetTranslations();


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
