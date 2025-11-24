import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {TabBar} from 'organisms';
import {FC} from 'react';
import {tabScreens} from './tabs-config';

export interface TabNavigatorProps {
}

const Tab = createBottomTabNavigator();

export const TabNavigator: FC<TabNavigatorProps> = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}>
      {tabScreens.map(tabScreen => {
        return <Tab.Screen key={tabScreen.name} {...tabScreen} />;
      })}
    </Tab.Navigator>
  );
};
