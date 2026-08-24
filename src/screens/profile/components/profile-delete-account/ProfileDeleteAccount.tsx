import {AlertModal} from 'molecules';
import {Cell} from 'organisms';
import {useCallback, useState} from 'react';
import {signOut} from 'helpers';
import {useTranslation} from 'react-i18next';
import {useUserDeleteMutation} from 'rtk';

const ProfileDeleteAccount = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [userDelete] = useUserDeleteMutation();

  const onDelete = useCallback(async () => {
    try {
      const response = await userDelete({
        showModal: true,
        showLoader: true,
      });

      if (response?.data?.success) {
        await signOut();
      }

    } catch {
    }
  }, []);

  return (
    <>
      <Cell
        type="icon"
        iconName="CloseRed"
        title={t('profile_delete_account')}
        titleProps={{textColor: 'accent_negative'}}
        description={t('profile_delete_account_subtitle')}
        showArrowIcon={false}
        onPress={() => setIsVisible(true)}
      />

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
