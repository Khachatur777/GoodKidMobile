import {createStackNavigator} from '@react-navigation/stack';
import {screenMainOptions} from '../tabs-config';
import {filterScreens} from './filter-config.tsx';

const PaymentsStack = createStackNavigator();

export const FilterTab = () => {
  return (
    <PaymentsStack.Navigator screenOptions={screenMainOptions}>
      {filterScreens.map(screen => (
        <PaymentsStack.Screen key={screen.name} {...screen} />
      ))}
    </PaymentsStack.Navigator>
  );
};
