import { About, AppColour, KidProfile } from 'screens';
import { IScreens } from '../tabs-config';
import i18n from 'i18next';

// В детском профиле только своё: карточка ребёнка, тема, цвет, About и выход.
// Языка нет — его задаёт родитель. Удаления аккаунта и поддержки тоже нет.
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
