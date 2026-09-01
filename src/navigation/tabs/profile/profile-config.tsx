import {
  About,
  AddChild,
  AddFirstChild,
  AppColour,
  ChildActivity,
  ChildMathSettings,
  ChildTasks,
  ChildVideoLock,
  Children,
  EditChild,
  LearningReport,
  Profile,
  Support,
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

export const profileScreens: IScreens[] = [
  {
    name: 'ProfileScreen',
    component: Profile,
    options: () => ({
      title: i18n.t('profile_header'),
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
