import { About, AppColour, KidProfile } from 'screens';
import { IScreens } from '../tabs-config';
import i18n from 'i18next';

// The child's profile holds only their own: their card, theme, colour, About and
// sign-out. No language — the parent sets it. No account deletion and no support.
export const kidProfileScreens: IScreens[] = [
  {
    name: 'KidProfileScreen',
    component: KidProfile,
    options: () => ({
      title: i18n.t('kid_profile_header'),
      type: 'title',
      showBackIcon: false,
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
];
