import { KidTasks } from 'screens';
import { IScreens } from '../tabs-config';
import i18n from 'i18next';

// The child's own tab. Only their tasks live here — the parent sets and confirms
// them from their profile, and the child never sees anyone else's.
export const tasksScreens: IScreens[] = [
  {
    name: 'KidTasksScreen',
    component: KidTasks,
    options: () => ({
      title: i18n.t('tasks_kid_header'),
      type: 'title',
      showBackIcon: false,
      showIconInTabScreen: false,
    }),
  },
];
