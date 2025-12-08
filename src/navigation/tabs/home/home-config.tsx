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
      headerShown: true,
      headerTransparent: false,
      backgroundColor: 'red_500',
    }),
  },
  {
    name: 'PlayVideoListScreen',
    component: PlayVideoList,
    options: () => ({
      title: i18n.t('youtube_video_title'),
      showBackIcon: true,
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
