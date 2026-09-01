import { createStackNavigator } from '@react-navigation/stack';
import { screenMainOptions } from '../tabs-config';
import { childrenScreens } from './children-config';

const ChildrenStack = createStackNavigator();

export const ChildrenTab = () => {
  return (
    <ChildrenStack.Navigator screenOptions={screenMainOptions}>
      {childrenScreens.map(screen => (
        <ChildrenStack.Screen key={screen.name} {...screen} />
      ))}
    </ChildrenStack.Navigator>
  );
};
