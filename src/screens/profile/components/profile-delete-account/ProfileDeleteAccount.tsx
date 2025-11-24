import {AlertModal, CardWrapper} from 'molecules';
import {Cell} from 'organisms';
import {profileStyle} from '../../profile-styles.ts';
import {useCallback, useState} from 'react';
import {signOut} from 'helpers';
import {useTranslation} from 'react-i18next';
import {getUserState, useUserDeleteMutation} from 'rtk';
import {usePinAction} from 'hooks';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const ProfileDeleteAccount = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [userDelete] = useUserDeleteMutation();
  const { startPinAction } = usePinAction();
  const user = useSelector(getUserState);

  const onDelete = useCallback(async () => {
    try {
      const pinRes = await startPinAction();
      const pinCode = pinRes?.data;

      if (+pinCode !== user?.pinCode) {

        return setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: t('pin_code_incorrect_title'),
            text2: t('pin_code_incorrect_description'),
            onPress: () => Toast.hide(),
          });
        }, 200);
      }

      const response = await userDelete({
        showModal: true,
        showLoader: true,
      });

      if (response?.data?.success) {
        await signOut();
      }

    } catch (error) {
    }
  }, []);

  return (
    <>
      <CardWrapper containerStyles={profileStyle({}).personalManager}>
        <Cell
          type="icon"
          iconName="CloseRed"
          title={t('profile_delete_account')}
          showArrowIcon={false}
          onPress={() => setIsVisible(true)}
        />
      </CardWrapper>

      <AlertModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title={t('profile_delete_account_title')}
        description={t('profile_delete_account_description')}
        iconProps={{ color: 'icon_tertiary', name: 'WarningCircleIcon' }}
        buttons={[
          {
            title: t('profile_delete_btn'),
            variant: 'negative',
            onPress: async () => {
              setIsVisible(false);
              await onDelete();
            },
          },
          {
            title: t('profile_delete_cancel_btn'),
            variant: 'secondary',
            onPress: () => setIsVisible(false),
          },
        ]}
      />
    </>
  );
};

export default ProfileDeleteAccount;
