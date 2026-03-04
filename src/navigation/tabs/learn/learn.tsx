import { NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FC } from 'react';
import { screenMainOptions } from '../tabs-config';
import { learnScreens } from './learn-config.tsx';

const LearnStack = createStackNavigator();

export interface HomeTabProps {
  navigation: NavigationProp<any>;
}

export const LearnTab: FC<HomeTabProps> = ({navigation}) => {

  return (
    <LearnStack.Navigator screenOptions={screenMainOptions}>
      {learnScreens.map(screen => (
        <LearnStack.Screen key={screen.name} {...screen} />
      ))}
    </LearnStack.Navigator>
  );
};
