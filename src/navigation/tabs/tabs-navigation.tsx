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
  // The tab set follows the role from the token: a child has no filter and no
  // parent sections, and cannot reach them from a child session.
  const role = useSelector(getRoleState);

  // On sign-out the role clears before the screens have unmounted. Swapping the
  // tab set at that moment rebuilds the navigator, and its own state update
  // overrides the reset to the sign-in screen that already happened — a child
  // ended up on the parent's home screen. So with no role we keep the previous
  // set: it only lives for the last moments before the sign-in screen.
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
