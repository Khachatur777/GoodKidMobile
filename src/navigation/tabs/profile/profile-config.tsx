import {
  Profile,
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
];
