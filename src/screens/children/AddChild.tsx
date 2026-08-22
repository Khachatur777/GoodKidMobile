import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Button, KeyboardAwareScrollView, Spacing } from 'molecules';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { getUserState, useCreateChildMutation } from 'rtk';
import { ThemeContext } from 'theme';
import { childrenStyles } from './children-styles';
import { ChildForm, IChildFormValues } from './components';
import { DEFAULT_KID_AVATAR_ID } from 'molecules';

export interface AddChildProps {
  navigation: NavigationProp<any>;
}

const AddChild: FC<AddChildProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childrenStyles(color), [color]);
  const parent = useSelector(getUserState);
  const [createChild] = useCreateChildMutation();

  const [values, setValues] = useState<IChildFormValues>({
    name: '',
    age: '',
    avatar: DEFAULT_KID_AVATAR_ID,
    language: parent?.profile?.preferredLanguages || 'en',
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [loginError, setLoginError] = useState('');

  const onChange = useCallback((patch: Partial<IChildFormValues>) => {
    setValues(prev => ({ ...prev, ...patch }));
    setLoginError('');
  }, []);

  const canSubmit =
    values.name.trim().length > 0 &&
    values.age.length > 0 &&
    values.login.length >= 4 &&
    values.password.length >= 6 &&
    values.password === values.confirmPassword;

  const onSubmit = useCallback(async () => {
    const response = await createChild({
      name: values.name.trim(),
      age: Number(values.age),
      avatar: values.avatar,
      language: values.language,
      login: values.login.trim().toLowerCase(),
      password: values.password,
      showLoader: true,
      // Занятый логин показываем прямо в поле, а не общей ошибкой
      showModal: false,
    });

    if (response?.data?.success) {
      return navigation.goBack();
    }

    const message = (response as any)?.error?.data?.message;
    if (message === 'child_login_taken') {
      setLoginError(t('child_login_taken'));
    }
  }, [createChild, navigation, t, values]);

  return (
    <BackgroundWrapper>
      <KeyboardAwareScrollView
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContainer}
      >
        <ChildForm values={values} onChange={onChange} loginError={loginError} />

        <Spacing size={24} />

        <View>
          <Button title={t('add_child_title')} disabled={!canSubmit} onPress={onSubmit} />
        </View>
      </KeyboardAwareScrollView>
    </BackgroundWrapper>
  );
};

export default AddChild;
