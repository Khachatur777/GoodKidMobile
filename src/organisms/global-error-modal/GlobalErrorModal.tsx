import {AlertModal} from '../../molecules/alert-modal';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {getGlobalError, showGlobalError} from 'rtk';

const GlobalErrorModal = () => {
  const error = useSelector(getGlobalError);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const onClose = useCallback((isVisible: boolean) => {
    dispatch(
      showGlobalError({
        title: '',
        description: '',
        isVisible,
      }),
    );
  }, []);

  return (
    error.isVisible && (
      <AlertModal
        showCloseBtn
        iconName="ErrorCircleIcon"
        title={error.title}
        description={error.description}
        isVisible={error.isVisible}
        setIsVisible={val => {
          onClose(val as boolean);
        }}
        buttons={[
          {
            title: t('close_global_error_modal'),
            onPress: () => onClose(false),
          },
        ]}
      />
    )
  );
};

export default GlobalErrorModal;
