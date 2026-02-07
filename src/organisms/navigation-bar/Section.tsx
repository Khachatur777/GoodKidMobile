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
    title,
    titleProps,
    leftIcon,
    renderRightSection,
    renderLeftSection,
    showBackIcon = false,
    defaultHeader = true,
  } = options;

  return (
    <View style={navBarStyles({ color }).sectionContainer}>
      <View style={navBarStyles({}).sectionLeftContainer}>
        {renderLeftSection?.(navigation)}

        {navigation.canGoBack() &&
        showBackIcon ? (
          <View style={navBarStyles({}).backTitleContainer}>
            <Pressable
              hitSlop={10}
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
              } style={navBarStyles({}).backTitleContainer}>
              <Icon
                color="icon_inverted_header"
                name="ChevronLeft"
                width={26}
                height={26}
                {...leftIcon}
              />

              {title && (
                <Typography
                  type="bodyL"
                  textColor='text_primary_header'
                  {...titleProps}>
                  {title}
                </Typography>
              )}
            </Pressable>
          </View>

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

      <View style={navBarStyles({}).sectionRightIconContainer}>
        {renderRightSection?.(navigation)}
      </View>
    </View>
  );
};

export default Section;
