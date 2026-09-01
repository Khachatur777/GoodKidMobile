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
    // Screens reached by resetting the stack (sign-in, say) have nowhere to go
    // back to — the arrow is hidden there
    showBackIcon = true,
  } = options;

  return (
    <View style={navBarStyles({}).titleContainer}>
      <View style={navBarStyles({}).titleTop}>
        <View style={navBarStyles({}).sectionLeftIconContainer}>
          {showBackIcon && navigation.canGoBack() ? (
            <Pressable
              hitSlop={10}
              style={navBarStyles({}).leftIcon}
              onPress={e => {
                e.preventDefault();
                navigation.goBack();
              }}
            >
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

      </View>

      {title && (
        // Растягивается, чтобы правая секция ушла к краю. Экраны без неё
        // выглядят как раньше: текст всё так же прижат влево.
        <View style={navBarStyles({}).titleText}>
          <Typography type="title1" {...titleProps}>
            {title}
          </Typography>
        </View>
      )}

      {/* Раньше правая секция лежала внутри строки со стрелкой «назад» и
          физически не могла оказаться справа. Её место — в конце. */}
      {renderRightSection ? (
        <View style={navBarStyles({}).sectionRightIconContainer}>
          {renderRightSection?.(navigation)}
        </View>
      ) : null}
    </View>
  );
};

export default Title;
