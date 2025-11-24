import { NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FC } from 'react';
import { screenMainOptions } from '../tabs-config';
import { homeScreens } from './home-config';

const HomeStack = createStackNavigator();

export interface HomeTabProps {
  navigation: NavigationProp<any>;
}

export const HomeTab: FC<HomeTabProps> = ({navigation}) => {

  return (
    <HomeStack.Navigator screenOptions={screenMainOptions}>
      {homeScreens.map(screen => (
        <HomeStack.Screen key={screen.name} {...screen} />
      ))}
    </HomeStack.Navigator>
  );
};
