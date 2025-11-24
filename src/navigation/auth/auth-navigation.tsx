import {createStackNavigator} from '@react-navigation/stack';
import {authScreens} from './auth-config';
import {screenMainOptions} from 'navigation/tabs';

const AuthStack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      screenOptions={screenMainOptions}>
      {authScreens.map(screen => (
        <AuthStack.Screen key={screen.name} {...screen} />
      ))}
    </AuthStack.Navigator>
  );
};

export default AuthNavigation;
