import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {Button, Spacing, Typography} from 'molecules';
import {FC, useCallback, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {IColor, ThemeContext} from 'theme';
import {error404Styles} from './error-404-styles';

export interface Error404Props {
  navigation: NavigationProp<any>;
  route: RouteProp<ParamListBase> & {
    params: {variant: 'primary' | 'secondary'};
  };
}

const Error404: FC<Error404Props> = ({route, navigation}) => {
  const {color} = useContext(ThemeContext);
  const {t} = useTranslation();

  const variant = route.params?.variant || 'primary';

  const getColor = useCallback(() => {
    switch (variant) {
      case 'primary':
        return {
          titleColor: 'text_primary',
          descriptionColor: 'text_secondary',
        };
      case 'secondary':
        return {
          titleColor: 'text_inverted',
          descriptionColor: 'text_inverted',
        };
      default:
        return {
          titleColor: 'text_primary',
          descriptionColor: 'text_secondary',
        };
    }
  }, [variant]);

  const renderError = useCallback(() => {
    switch (variant) {
      case 'primary':
        return <View style={error404Styles({color}).primary} />;
      case 'secondary':
        return (
          <Typography
            type="titleXL"
            textStyles={error404Styles({}).secondary}
            textColor="text_inverted">
            404
          </Typography>
        );
      default:
        return <></>;
    }
  }, [variant, color]);

  const goHome = useCallback(() => {
    navigation.navigate('HomeScreen');
  }, [navigation]);

  return (
    <View style={error404Styles({color, variant}).container}>
      {renderError()}

      <Spacing size={24} />

      <Typography
        alignment="center"
        type="title2"
        textColor={getColor().titleColor as IColor}>
        {t('error_404_title')}
      </Typography>

      <Spacing size={8} />

      <Typography
        alignment="center"
        textColor={getColor().descriptionColor as IColor}>
        {t('error_404_description')}
      </Typography>

      <Spacing size={32} />

      <Button
        variant={variant}
        title={t('error_404_back_to_home')}
        onPress={goHome}
      />
    </View>
  );
};

export default Error404;
