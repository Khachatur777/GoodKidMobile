import {IScreens} from 'navigation';
import {
  Error404,
  Home,
  Search,
  PlayVideoList
} from 'screens';
import i18n from "i18next";

export const homeScreens: IScreens[] = [
  {
    name: 'HomeScreen',
    component: Home,
    options: () => ({
      headerShown: false,
    }),
  },
  {
    name: 'PlayVideoListScreen',
    component: PlayVideoList,
    options: () => ({
      headerShown: false,
    }),
  },
  {
    name: 'SearchScreen',
    component: Search,
    options: () => ({
      headerShown: false,
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
