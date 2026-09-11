import LanguageSession from 'screens/language/LanguageSession';
import {IScreens} from 'navigation';
import { CardCategories, CardSession, MathCard, MathCategories, MathResult, Sections } from 'screens';
import i18n from 'i18next';

export const learnScreens: IScreens[] = [
  {
    name: 'SectionsScreen',
    component: Sections,
    options: () => ({
      title: i18n.t('learn_header'),
      type: 'title',
      showBackIcon: false,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'CardCategories',
    component: CardCategories,
    options: () => ({
      title: i18n.t('section_world'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    // Как и математическая сессия, занимает экран целиком.
    name: 'CardSession',
    component: CardSession,
    options: () => ({
      headerShown: false,
    }),
  },
  {
    name: 'MathCategories',
    component: MathCategories,
    options: () => ({
      title: i18n.t('math_section'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    // Свой хедер: сессия занимает экран целиком, а выход и пропуск живут внутри.
    name: 'MathCard',
    component: MathCard,
    options: () => ({
      headerShown: false,
      tabBarStyle: {display: 'none'},
    }),
  },
  {
    name: 'MathResult',
    component: MathResult,
    options: () => ({
      headerShown: false,
      tabBarStyle: {display: 'none'},
      // Назад с экрана результата возвращал бы в уже завершённую сессию.
      gestureEnabled: false,
    }),
  },
  {name: 'LanguageSession', component: LanguageSession, options: () => ({headerShown: false, gestureEnabled: false, tabBarStyle: {display: 'none'}})},
];
