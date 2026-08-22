import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {TabBar} from 'organisms';
import {FC} from 'react';
import {useSelector} from 'react-redux';
import {getIsChildState} from 'rtk';
import {kidTabScreens, parentTabScreens} from './tabs-config';

export interface TabNavigatorProps {
}

const Tab = createBottomTabNavigator();

export const TabNavigator: FC<TabNavigatorProps> = () => {
  // Набор табов выбирается по роли из токена: у ребёнка нет фильтра и
  // родительских разделов, попасть в них из детской сессии нельзя.
  const isChild = useSelector(getIsChildState);
  const screens = isChild ? kidTabScreens : parentTabScreens;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}>
      {screens.map(tabScreen => {
        return <Tab.Screen key={tabScreen.name} {...tabScreen} />;
      })}
    </Tab.Navigator>
  );
};
