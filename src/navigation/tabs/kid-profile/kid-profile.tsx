import { createStackNavigator } from '@react-navigation/stack';
import { screenMainOptions } from '../tabs-config';
import { kidProfileScreens } from './kid-profile-config';

const KidProfileStack = createStackNavigator();

export const KidProfileTab = () => {
  return (
    <KidProfileStack.Navigator screenOptions={screenMainOptions}>
      {kidProfileScreens.map(screen => (
        <KidProfileStack.Screen key={screen.name} {...screen} />
      ))}
    </KidProfileStack.Navigator>
  );
};
