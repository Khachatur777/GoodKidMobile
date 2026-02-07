import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Route, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {hideTabBar} from 'app-constants';
import {Icon, Typography} from 'molecules';
import {FC, useCallback, useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import {
  getIsTabBarHiddenState,
} from 'rtk';
import {ThemeContext} from 'theme';
import {tabBarStyles} from './tab-bar-styles';

export interface TabBarProps extends BottomTabBarProps {}

const TabBar: FC<TabBarProps> = ({descriptors, state, navigation}) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const {color} = useContext(ThemeContext);
  const isTabBarHidden = useSelector(getIsTabBarHiddenState);


  const hideTabBarFromScreens = hideTabBar();

  const getTabBarVisibility = useCallback(
    (route: Partial<Route<string>>) => {
      if (route) {
        const routeName = getFocusedRouteNameFromRoute?.(route);

        if (hideTabBarFromScreens.includes(routeName || '')) {
          translateY.value = -84;
          return false;
        } else {
          translateY.value = 0;
          return true;
        }
      }
    },
    [hideTabBarFromScreens],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      bottom: withTiming(translateY.value, {
        duration: 300,
      }),
    };
  });

  useEffect(() => {
    // getTabBarVisibility function hides tab bar when hideTabBarFromScreens includes current screen`s route, and it returns a boolean,
    // If tab bar is shown and keyboard is open, we also need to hide it
    // When tab bar is hidden and we toggle the keyboard and hide tab bar functionality works and after closing keyboard it becomes visible
    // For preventing that situation we put this if statement here
    if (
      !getTabBarVisibility(descriptors[state?.routes?.[state?.index].key].route)
    )
      return;

    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      //Whenever keyboard did show make it invisible
      translateY.value = -84;
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      translateY.value = 0;
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [getTabBarVisibility]);

  return (
    !isTabBarHidden && (
      <Animated.View
        entering={FadeInDown}
        style={[
          tabBarStyles({color}).container,
          animatedStyle,
          /* @ts-ignore */
          descriptors[state?.routes?.[state?.index].key]?.options?.tabBarStyle,
        ]}>
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const getIcon = () => {
            switch (label) {
              case 'HomeTab':
                return (
                  <Icon
                    color={
                      isFocused
                        ? 'red_500'
                        : 'controls_tab_bar_inactive'
                    }
                    name="Home04Icon"
                  />
                );
              case 'FilterTab':
                return (
                  <Icon
                    color={
                      isFocused
                        ? 'red_500'
                        : 'controls_tab_bar_inactive'
                    }
                    name="Sliders04Icon"
                  />
                );
              case 'ProfileTab':
                return (
                  <Icon
                    color={
                      isFocused
                        ? 'red_500'
                        : 'controls_tab_bar_inactive'
                    }
                    name="User02Icon"
                  />
                );
              default:
                break;
            }
          };
          const getTabTranslation = () => {
            switch (label) {
              case 'HomeTab':
                return t('home_tab');
              case 'FilterTab':
                return t('filter_tab');
              case 'ProfileTab':
                return t('profile_tab');
              default:
                break;
            }
          };

          const onPress = async () => {

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.reset({
                routes: [
                  {
                    name: route.name,
                  },
                ],
                index: 0,
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View key={route.name} style={tabBarStyles({}).tabButtonContainer}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={tabBarStyles({}).tabButton}>
                <View style={tabBarStyles({}).iconContainer}>

                  {getIcon()}
                </View>

                <Typography
                  type="captionBold"
                  numberOfLines={1}
                  textColor={
                    isFocused
                      ? 'red_500'
                      : 'controls_tab_bar_inactive'
                  }>
                  {getTabTranslation()}
                </Typography>
              </TouchableOpacity>
            </View>
          );
        })}
      </Animated.View>
    )
  );
};

export default TabBar;
