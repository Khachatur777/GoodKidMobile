import i18n from 'i18next';
import {
  Filter,
} from 'screens';
import {IScreens} from '../tabs-config';

export const filterScreens: IScreens[] = [
  //Filter
  {
    name: 'Filter',
    component: Filter,
    options: () => ({
     title: i18n.t('filter_header'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },

];
