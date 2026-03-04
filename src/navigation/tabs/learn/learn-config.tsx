import {IScreens} from 'navigation';
import { Learn, LearnExplanation } from 'screens';
import i18n from 'i18next';

export const learnScreens: IScreens[] = [
  {
    name: 'LearnScreen',
    component: Learn,
    options: () => ({
      title: i18n.t('learn_header'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'LearnExplanation',
    component: LearnExplanation,
    options: () => ({
      title: i18n.t('LearnExplanation'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
];
