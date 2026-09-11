import ChildLanguage from 'screens/language/ChildLanguage';
import {
  AddChild,
  Child,
  AddFirstChild,
  ChildActivity,
  ChildMathSettings,
  ChildTasks,
  ChildVideoLock,
  Children,
  EditChild,
  LearningReport,
  TaskForm,
  TaskTemplates,
} from 'screens';
import {IScreens} from '../tabs-config';
import i18n from 'i18next';
import {NavigationProp, ParamListBase, RouteProp} from '@react-navigation/native';
import {Pressable} from 'react-native';
import {Icon} from 'molecules';

// Квадратная кнопка-действие в шапке. Размеры из макета: 40×40, радиус 14.
const headerActionStyle = {
  width: 40,
  height: 40,
  borderRadius: 14,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

// Всё про детей живёт в своей вкладке, а не в настройках профиля: это то, ради
// чего родитель открывает приложение, а не строчка среди языка и темы.
export const childrenScreens: IScreens[] = [
  {
    name: 'ChildrenScreen',
    component: Children,
    options: () => ({
      title: i18n.t('children_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    // Страница ребёнка: карточка в списке ведёт сюда, а разделы стали строками
    // со значением справа. Правка профиля — карандаш в шапке, как в макете.
    name: 'ChildScreen',
    component: Child,
    options: ({route}: {route: RouteProp<ParamListBase, string>}) => ({
      title: (route.params as {childName?: string})?.childName || i18n.t('children_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
      renderRightSection: (navigation: NavigationProp<any>) => (
        <Pressable
          hitSlop={8}
          style={headerActionStyle}
          onPress={() =>
            navigation.navigate('EditChildScreen', {
              childId: (route.params as {childId?: string})?.childId,
            })
          }
        >
          <Icon name="Edit02Icon" width={22} height={22} color="icon_secondary" />
        </Pressable>
      ),
    }),
  },
  {
    name: 'AddChildScreen',
    component: AddChild,
    options: () => ({
      title: i18n.t('add_child_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'AddFirstChildScreen',
    component: AddFirstChild,
    options: () => ({
      title: '',
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'EditChildScreen',
    component: EditChild,
    options: () => ({
      title: i18n.t('edit_child_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'ChildActivityScreen',
    component: ChildActivity,
    options: () => ({
      title: i18n.t('child_activity_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'LearningReportScreen',
    component: LearningReport,
    options: () => ({
      title: i18n.t('report_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'ChildMathScreen',
    component: ChildMathSettings,
    options: () => ({
      title: i18n.t('child_math_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'ChildTasksScreen',
    component: ChildTasks,
    // Шаблоны живут закладкой в шапке, а не второй кнопкой внизу: внизу должно
    // остаться одно действие — выдать задачу.
    options: ({route}: {route: RouteProp<ParamListBase, string>}) => ({
      title: i18n.t('tasks_parent_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
      renderRightSection: (navigation: NavigationProp<any>) => (
        <Pressable
          hitSlop={8}
          style={headerActionStyle}
          onPress={() =>
            navigation.navigate('TaskTemplatesScreen', {
              childId: (route.params as {childId?: string})?.childId,
            })
          }
        >
          <Icon name="BookmarkIcon" width={22} height={22} color="accent_active" />
        </Pressable>
      ),
    }),
  },
  {
    name: 'TaskFormScreen',
    component: TaskForm,
    options: () => ({
      title: i18n.t('tasks_new'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'TaskTemplatesScreen',
    component: TaskTemplates,
    options: () => ({
      title: i18n.t('tasks_templates_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {
    name: 'ChildVideoLockScreen',
    component: ChildVideoLock,
    options: () => ({
      title: i18n.t('video_lock_title'),
      type: 'title',
      showBackIcon: true,
      showIconInTabScreen: false,
    }),
  },
  {name: 'ChildLanguageScreen', component: ChildLanguage, options: () => ({title: i18n.t('section_language'), type: 'title', showBackIcon: true, showIconInTabScreen: false})},
];
