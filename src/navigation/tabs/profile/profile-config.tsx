import {
  About,
  AppColour,
  Profile,
  Support,
} from 'screens';
import {IScreens} from '../tabs-config';
import i18n from 'i18next';

export const profileScreens: IScreens[] = [
  {
    name: 'ProfileScreen',
    component: Profile,
    options: () => ({
      title: i18n.t('profile_header'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'AppColourScreen',
    component: AppColour,
    options: () => ({
      title: i18n.t('app_colour'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'AboutScreen',
    component: About,
    options: () => ({
      title: i18n.t('about_app'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'SupportScreen',
    component: Support,
    options: () => ({
      title: i18n.t('profile_support'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
];
