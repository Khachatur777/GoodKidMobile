import {AlertModal} from 'molecules';
import {Cell} from 'organisms';
import {useState} from 'react';
import {signOut} from 'helpers';
import {useTranslation} from 'react-i18next';

const ProfileLogOut = () => {
  const {t} = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Cell
        type="icon"
        iconName="LogOut01Icon"
        title={t('profile_log_out')}
        showArrowIcon={false}
        onPress={() => setIsVisible(true)}
      />

      <AlertModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title={t('profile_log_out_alert_title')}
        description={t('profile_log_out_alert_description')}
        iconProps={{name: 'LogOut01Icon'}}
        buttons={[
          {
            title: t('profile_log_out_btn'),
            variant: 'primary',
            onPress: signOut,
          },
          {
            title: t('profile_log_out_cancel_btn'),
            variant: 'outline',
            onPress: () => setIsVisible(false),
          },
        ]}
      />
    </>
  );
};

export default ProfileLogOut;
