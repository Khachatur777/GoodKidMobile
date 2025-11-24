import {IScreens} from 'navigation';
import {
  Error404,
  Home,
} from 'screens';
import Search from 'screens/search/Search.tsx';

export const homeScreens: IScreens[] = [
  {
    name: 'HomeScreen',
    component: Home,
    options: () => ({
      headerShown: true,
      headerTransparent: false,
      backgroundColor: 'red_500',
    }),
  },
  {
    name: 'SearchScreen',
    component: Search,
    options: () => ({
      headerShown: true,
      headerTransparent: false,
      showBackIcon: true,
      backgroundColor: 'red_500',
    }),
  },
  {
    name: 'Error404',
    component: Error404,
    options: () => ({
      headerShown: false,
    }),
  },
];
