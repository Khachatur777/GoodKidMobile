import { Icon, Typography } from 'molecules';
import { FC, useContext } from 'react';
import { Image, Pressable, View } from 'react-native';
import { ThemeContext } from 'theme';
import { INavigationHeaderProps } from './NavigationBar';
import { navBarStyles } from './navigation-bar-styles';
import { LogoWhite } from 'assets';

const Section: FC<INavigationHeaderProps & { isTab: boolean }> = ({
                                                                    options,
                                                                    navigation,
                                                                    isTab,
                                                                  }) => {
  const { color } = useContext(ThemeContext);

  const {
    icon,
    title,
    titleProps,
    subTitle,
    subTitleProps,
    leftIcon,
    renderRightSection,
    renderLeftSection,
    showBackIcon = false,
    defaultHeader = true,
  } = options;

  return (
    <View style={navBarStyles({ color }).sectionContainer}>
      <View style={navBarStyles({}).sectionLeftIconContainer}>
        {renderLeftSection?.(navigation)}

        {navigation.canGoBack() &&
        showBackIcon ? (
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
          ) :
          defaultHeader ?
            (

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
                <Image source={LogoWhite} style={navBarStyles({}).logoImag} />
              </Pressable>

            ) : (
              <></>
            )}
      </View>

      <View style={navBarStyles({}).sectionTitleContainer}>
        {icon && <Icon {...icon} />}

        {title && (
          <Typography
            type="headline"
            textColor="text_primary"
            textStyles={navBarStyles({}).textCenter}
            {...titleProps}>
            {title}
          </Typography>
        )}

        {subTitle && (
          <Typography
            type="caption"
            textColor="text_secondary"
            textStyles={navBarStyles({}).textCenter}
            {...subTitleProps}>
            {subTitle}
          </Typography>
        )}
      </View>

      <View style={navBarStyles({}).sectionRightIconContainer}>
        {renderRightSection?.(navigation)}
      </View>
    </View>
  );
};

export default Section;
