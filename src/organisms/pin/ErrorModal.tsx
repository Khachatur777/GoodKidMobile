import {AlertModal} from 'molecules';
import {Dispatch, FC, SetStateAction} from 'react';
import {useTranslation} from 'react-i18next';

export interface ErrorModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<
    SetStateAction<{
      isVisible: boolean;
      message: string;
    }>
  >;
  message: string;
}

const ErrorModal: FC<ErrorModalProps> = ({
  isVisible,
  setIsVisible,
  message,
}) => {
  const {t} = useTranslation();

  return (
    isVisible && (
      <AlertModal
        hideModalWhenPinIsVisible={false}
        showCloseBtn
        iconName="ErrorCircleIcon"
        title={t('pin_error_modal_title')}
        description={message}
        isVisible={isVisible}
        setIsVisible={val => {
          setIsVisible({
            isVisible: val as boolean,
            message: '',
          });
        }}
        buttons={[
          {
            title: t('close_global_error_modal'),
            onPress: () =>
              setIsVisible({
                isVisible: false,
                message: '',
              }),
          },
        ]}
      />
    )
  );
};

export default ErrorModal;
