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
import { KidProfileTab } from './kid-profile';

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

// Родитель: Home, Filter, Learn, Profile
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
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('LearnTab', {
          screen: 'LearnScreen',
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

// Ребёнок: Home, Learn, Me. Фильтра у него нет — выдачу настроил родитель,
// и сервер применяет её сам, что бы ни прислал клиент.
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
    name: 'LearnTab',
    component: LearnTab,
    listeners: ({ navigation }: { navigation: NavigationProp<any> }) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('LearnTab', {
          screen: 'LearnScreen',
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
