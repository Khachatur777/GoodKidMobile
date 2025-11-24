import {NavigationProp} from '@react-navigation/native';
import {StackHeaderProps} from '@react-navigation/stack';
import {useStatusBarHeight} from 'hooks';
import {IconProps, TypographyProps} from 'molecules';
import {FC, ReactNode, useCallback, useContext} from 'react';
import {View} from 'react-native';
import {IColor, ThemeContext} from 'theme';
import Section from './Section';
import Title from './Title';
import {navBarStyles} from './navigation-bar-styles';

export type INavigationHeaderProps = StackHeaderProps & {
  options: StackHeaderProps['options'] & {
    backgroundColor?: IColor;
    backgroundColorOpacity?: number;
    showIconInTabScreen?: boolean;
    type?: 'section' | 'search' | 'title';
    title?: string;
    titleProps?: Omit<TypographyProps, 'children'>;
    subTitle?: string;
    subTitleProps?: Omit<TypographyProps, 'children'>;
    icon?: IconProps;
    leftIcon?: IconProps;
    showBackIcon?: boolean;
    defaultHeader?: boolean;
    renderRightSection?: (navigation: NavigationProp<any>) => ReactNode;
    renderLeftSection?: (navigation: NavigationProp<any>) => ReactNode;
    onLeftIconPress?: () => void;
  };
};

export interface NavigationBarProps {
  headerProps: INavigationHeaderProps;
  children?: ReactNode;
}

const NavigationBar: FC<NavigationBarProps> = ({headerProps, children}) => {
  const {color} = useContext(ThemeContext);
  const statusBarHeight = useStatusBarHeight();

  const {
    type = 'section',
    backgroundColor,
    backgroundColorOpacity,
  } = headerProps.options;

  const isTab =
    headerProps.route?.name === 'HomeScreen'

  const renderNavType = useCallback(() => {

    switch (type) {
      case 'section':
        return <Section isTab={isTab} {...headerProps} />;
      case 'title':
        return <Title {...headerProps} />;
      default:
        return <></>;
    }
  }, [type, headerProps.options]);

  return (
    <View
      style={
        navBarStyles({
          color,
          statusBarHeight,
          backgroundColor,
          backgroundColorOpacity,
        }).container
      }>
      {renderNavType()}
    </View>
  );
};

export default NavigationBar;
