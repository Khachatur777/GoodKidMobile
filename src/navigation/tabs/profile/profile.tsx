import {createStackNavigator} from '@react-navigation/stack';
import {screenMainOptions} from '../tabs-config';
import {profileScreens} from './profile-config';

const ProductsStack = createStackNavigator();

export const ProfileTab = () => {
  return (
    <ProductsStack.Navigator screenOptions={screenMainOptions}>
      {profileScreens.map(screen => (
        <ProductsStack.Screen key={screen.name} {...screen} />
      ))}
    </ProductsStack.Navigator>
  );
};
