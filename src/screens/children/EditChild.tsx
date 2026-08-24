import { NavigationProp, RouteProp } from '@react-navigation/native';
import {
  AlertModal,
  BackgroundWrapper,
  Button,
  KeyboardAwareScrollView,
  PasswordField,
  Spacing,
} from 'molecules';
import { Cell } from 'organisms';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  getChildrenState,
  useChangeChildPasswordMutation,
  useDeleteChildMutation,
  useUpdateChildMutation,
} from 'rtk';
import { ThemeContext } from 'theme';
import { childrenStyles } from './children-styles';
import { ChildForm, IChildFormValues } from './components';

export interface EditChildProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { childId: string } }, 'params'>;
}

const EditChild: FC<EditChildProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childrenStyles(color), [color]);
  const children = useSelector(getChildrenState);
  const child = children.find(item => item.id === route.params?.childId);

  const [updateChild] = useUpdateChildMutation();
  const [changePassword] = useChangeChildPasswordMutation();
  const [deleteChild] = useDeleteChildMutation();

  const [values, setValues] = useState<IChildFormValues>({
    name: child?.name || '',
    age: child?.age ? String(child.age) : '',
    avatar: child?.avatar || 'avatar_1',
    language: child?.language || 'en',
    login: child?.login || '',
    password: '',
    confirmPassword: '',
  });
  const [loginError, setLoginError] = useState('');
  const [passwordModal, setPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);

  const onChange = useCallback((patch: Partial<IChildFormValues>) => {
    setValues(prev => ({ ...prev, ...patch }));
    setLoginError('');
  }, []);

  const onSave = useCallback(async () => {
    if (!child) return;

    const response = await updateChild({
      id: child.id,
      name: values.name.trim(),
      age: Number(values.age),
      avatar: values.avatar,
      language: values.language,
      login: values.login.trim().toLowerCase(),
      showLoader: true,
      showModal: false,
    });

    if (response?.data?.success) {
      return navigation.goBack();
    }

    if ((response as any)?.error?.data?.message === 'child_login_taken') {
      setLoginError(t('child_login_taken'));
    }
  }, [child, navigation, t, updateChild, values]);

  const onChangePassword = useCallback(async () => {
    if (!child || newPassword.length < 6) return;

    // Changing the password drops the child from every device — the server decides that
    const response = await changePassword({
      id: child.id,
      password: newPassword,
      showLoader: true,
      showModal: true,
    });

    if (response?.data?.success) {
      setPasswordModal(false);
      setNewPassword('');
    }
  }, [changePassword, child, newPassword]);

  const onDelete = useCallback(async () => {
    if (!child) return;

    const response = await deleteChild({ id: child.id });

    if (response?.data?.success) {
      setDeleteModal(false);
      navigation.goBack();
    }
  }, [child, deleteChild, navigation]);

  if (!child) return <BackgroundWrapper />;

  return (
    <BackgroundWrapper>
      <KeyboardAwareScrollView
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.formContainer}
      >
        <ChildForm
          values={values}
          onChange={onChange}
          loginError={loginError}
          showAvatarHint={false}
          showPasswordFields={false}
        />

        <View style={styles.dangerCard}>
          <Cell
            type="icon"
            iconName="Lock"
            title={t('child_change_password')}
            onPress={() => setPasswordModal(true)}
          />

          <Cell
            type="icon"
            iconName="TrashIcon"
            iconProps={{ color: 'accent_negative' }}
            titleProps={{ textColor: 'accent_negative' }}
            title={t('child_delete')}
            description={t('child_delete_subtitle')}
            showArrowIcon={false}
            onPress={() => setDeleteModal(true)}
          />
        </View>

        <Spacing size={24} />

        <Button title={t('edit_child_save')} onPress={onSave} />
      </KeyboardAwareScrollView>

      <AlertModal
        isVisible={passwordModal}
        setIsVisible={setPasswordModal}
        title={t('child_change_password')}
        description={
          <PasswordField
            size="large"
            value={newPassword}
            onChangeText={setNewPassword}
            label={t('child_password_label')}
          />
        }
        buttons={[
          {
            title: t('save'),
            onPress: onChangePassword,
          },
          {
            title: t('cancel'),
            variant: 'outline',
            onPress: () => setPasswordModal(false),
          },
        ]}
      />

      <AlertModal
        isVisible={deleteModal}
        setIsVisible={setDeleteModal}
        title={t('child_delete_title', { name: child.name })}
        description={t('child_delete_description')}
        tone="negative"
        iconProps={{ name: 'TrashIcon' }}
        buttons={[
          {
            title: t('child_delete'),
            variant: 'destructive',
            onPress: onDelete,
          },
          {
            title: t('cancel'),
            variant: 'outline',
            onPress: () => setDeleteModal(false),
          },
        ]}
      />
    </BackgroundWrapper>
  );
};

export default EditChild;
