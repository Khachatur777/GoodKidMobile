import { View } from 'react-native';
import { Button, Typography } from 'molecules';
import { useTranslation } from 'react-i18next';
import { noSignInStyles } from './no-sign-in-styles.ts';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const NoSignIn = ({typeDescription}: {typeDescription: string}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const {t} = useTranslation()

  return (
    <View style={noSignInStyles().container}>
        <Typography type={'title2'}>{typeDescription === 'profile' ? t('no_sign_in_profile') : t('no_sign_in_filter')}</Typography>

      <View style={noSignInStyles().buttonContainer}>
        <Button
          title={t('no_sign_in')}
          size="large"
          onPress={() => {
            navigation.navigate('AuthNavigation', {screen: 'SignIn'})
          }}
        />
      </View>

    </View>
  );
};

export default NoSignIn;
