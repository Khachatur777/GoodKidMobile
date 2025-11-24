import { Icon, Typography } from 'molecules';
import { FC } from 'react';
import { Pressable, View } from 'react-native';
import { INavigationHeaderProps } from './NavigationBar';
import { navBarStyles } from './navigation-bar-styles';

const Title: FC<INavigationHeaderProps> = ({options, navigation}) => {

  const {
    title,
    titleProps,
    leftIcon,
    renderRightSection,
    onLeftIconPress = undefined,
    showIconInTabScreen = true,
    showBackIcon = true
  } = options;

  return (
    <View style={navBarStyles({}).titleContainer}>
      <View style={navBarStyles({}).titleTop}>
        <View style={navBarStyles({}).sectionLeftIconContainer}>
          {showBackIcon ?
            navigation.canGoBack() && showIconInTabScreen ? (
            <Pressable
              hitSlop={10}
              style={navBarStyles({}).leftIcon}
              onPress={onLeftIconPress || navigation.goBack}>
              <Icon
                color="icon_secondary"
                name="ChevronLeft"
                width={24}
                height={24}
                {...leftIcon}
              />
            </Pressable>
          ) : (
            <Pressable
              hitSlop={10}
              style={navBarStyles({}).leftIcon}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'HomeTab',
                      params: {
                        screen: 'HomeScreen',
                      },
                    },
                  ],
                })
              }>
              <Icon
                color="icon_secondary"
                name="ChevronLeft"
                width={24}
                height={24}
                {...leftIcon}
              />
            </Pressable>
          ) : null}
        </View>

        {renderRightSection ?
        <View style={navBarStyles({}).sectionRightIconContainer}>
          {renderRightSection?.(navigation)}
        </View>
          :
          null
        }
      </View>

      {title && (
        <Typography type="title1" {...titleProps}>
          {title}
        </Typography>
      )}

      <View/>

    </View>
  );
};

export default Title;
