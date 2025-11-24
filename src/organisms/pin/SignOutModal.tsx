import {signOut} from 'helpers';
import {AlertModal} from 'molecules';
import {Dispatch, FC, SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';

export interface SignOutModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const SignOutModal: FC<SignOutModalProps> = ({isVisible, setIsVisible}) => {
  const {t} = useTranslation();

  return (
    isVisible && (
      <AlertModal
        iconName="LogOut01Icon"
        title={t('pin_sign_out_modal_title')}
        description={t('pin_sign_out_modal_description')}
        hideModalWhenPinIsVisible={false}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        buttons={[
          {
            variant: 'negative',
            title: t('ok_sign_out'),
            onPress: () => {
              setIsVisible(false);
              signOut();
            },
          },
          {
            variant: 'secondary',
            title: t('cancel_log_out'),
            onPress: () => setIsVisible(false),
          },
        ]}
      />
    )
  );
};

export default SignOutModal;
