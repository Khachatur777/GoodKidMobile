import {
  EventMapBase,
  NavigationProp,
  ParamListBase,
  RouteConfig,
  RouteProp,
} from '@react-navigation/native';
import {StackHeaderProps} from '@react-navigation/stack';
import {INavigationHeaderProps, NavigationBar} from 'organisms';
import {HomeTab} from './home';
import {FilterTab} from './filter';
import {ProfileTab} from './profile';
import { LearnTab } from './learn';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// Экраны сессии занимают телефон целиком: под таб-баром тонула бы кнопка
// «Готово», а выйти из задания и так можно крестиком слева.
const FULL_SCREEN_ROUTES = ['MathCard', 'MathResult', 'CardSession'];

const hideTabBarOnSession = ({ route }: { route: any }) => {
  const focused = getFocusedRouteNameFromRoute(route);
  return focused && FULL_SCREEN_ROUTES.includes(focused)
    ? { tabBarStyle: { display: 'none' as const } }
    : {};
};
import { KidProfileTab } from './kid-profile';
import { TasksTab } from './tasks';

export type ScreenTypes = RouteConfig<ParamListBase, any, any, {}, EventMapBase, any>;

export interface IScreens {
  name: string;
  component: any;
  options:
    | INavigationHeaderProps['options']
    | ((props: {
        route: RouteProp<ParamListBase, string>;
        navigation: any;
      }) => INavigationHeaderProps['options']);
}

// Parent: Home, Filter, Learn, Profile
export const parentTabScreens: ScreenTypes[] = [
  {
    name: 'HomeTab',
    component: HomeTab,
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('HomeTab', {
          screen: 'Search',
        });
      },
    }),
  },
  {
    name: 'FilterTab',
    component: FilterTab,
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('FilterTab', {
          screen: 'Filter',
        });
      },
    }),
  },
  {
    name: 'LearnTab',
    component: LearnTab,
    options: hideTabBarOnSession,
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('LearnTab', {
          screen: 'SectionsScreen',
        });
      },
    }),
  },
  {
    name: 'ProfileTab',
    component: ProfileTab,
    options: {
      unmountOnBlur: true,
    },
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('ProfileTab', {
          screen: 'Profile',
        });
      },
    }),
  },
];

// Child: Home, Tasks, Learn, Me. No filter — the parent set the feed and the
// server applies it regardless of what the client sends.
//
// Tasks sit next to Home on purpose: when video is locked the child lands on
// Home and the way to open it is the neighbouring tab.
export const kidTabScreens: ScreenTypes[] = [
  {
    name: 'HomeTab',
    component: HomeTab,
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('HomeTab', {
          screen: 'Search',
        });
      },
    }),
  },
  {
    name: 'TasksTab',
    component: TasksTab,
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('TasksTab', {
          screen: 'KidTasksScreen',
        });
      },
    }),
  },
  {
    name: 'LearnTab',
    component: LearnTab,
    options: hideTabBarOnSession,
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('LearnTab', {
          screen: 'SectionsScreen',
        });
      },
    }),
  },
  {
    name: 'KidProfileTab',
    component: KidProfileTab,
    options: {
      unmountOnBlur: true,
    },
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('KidProfileTab', {
          screen: 'KidProfileScreen',
        });
      },
    }),
  },
];

export const screenMainOptions = {
  header: (props: StackHeaderProps) => <NavigationBar headerProps={props} />,
  headerStyle: {
    backgroundColor: 'transparent',
  },
};
