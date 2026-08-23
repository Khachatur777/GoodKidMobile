import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {TabBar} from 'organisms';
import {FC, useRef} from 'react';
import {useSelector} from 'react-redux';
import {getRoleState} from 'rtk';
import {kidTabScreens, parentTabScreens} from './tabs-config';

export interface TabNavigatorProps {
}

const Tab = createBottomTabNavigator();

export const TabNavigator: FC<TabNavigatorProps> = () => {
  // Набор табов выбирается по роли из токена: у ребёнка нет фильтра и
  // родительских разделов, попасть в них из детской сессии нельзя.
  const role = useSelector(getRoleState);

  // При выходе роль обнуляется раньше, чем экраны успевают размонтироваться.
  // Если в этот момент подменить набор табов, навигатор пересобирается и своим
  // обновлением состояния перебивает уже сделанный сброс на экран входа —
  // ребёнок оказывался на родительском Home. Поэтому без роли держим прежний
  // набор: он всё равно живёт последние мгновения до ухода на логин.
  const wasChild = useRef(false);
  if (role) wasChild.current = role === 'child';

  const screens = wasChild.current ? kidTabScreens : parentTabScreens;

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
