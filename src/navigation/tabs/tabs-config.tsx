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

export const tabScreens: ScreenTypes[] = [
  {
    name: 'HomeTab',
    component: HomeTab,
    listeners: ({navigation}: {navigation: NavigationProp<any>}) => ({
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
    listeners: ({navigation}: {navigation: NavigationProp<any>}) => ({
      tabPress: (e: any) => {
        e.preventDefault();
        navigation.navigate('FilterTab', {
          screen: 'Filter',
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
    listeners: ({navigation}: {navigation: NavigationProp<any>}) => ({
      tabPress: (e: any) => {
        navigation.navigate('ProfileTab', {
          screen: 'Profile',
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
