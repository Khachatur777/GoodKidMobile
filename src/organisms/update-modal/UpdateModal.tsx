import { AlertModal } from '../../molecules/alert-modal';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getUpdateState, setUpdateIsVisibleData } from 'rtk';
import { Linking, Platform } from 'react-native';

const STORE_URL = Platform.select({
  ios: 'itms-apps://itunes.apple.com/app/id000000000?action=write-review',
  android: 'https://play.google.com/store/apps/details?id=com.goodkid',
});

const UpdateModal = () => {
  const updateIsVisible = useSelector(getUpdateState);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onClose = useCallback(() => {
    dispatch(setUpdateIsVisibleData(false));
  }, []);

  const onUpdate = useCallback(() => {
    const url = STORE_URL || '';

    Linking.openURL(url)

    dispatch(setUpdateIsVisibleData(false));
  }, []);

  if (!updateIsVisible) return null;

  return (
    <AlertModal
      showCloseBtn
      title={t('update_title')}
      description={t('update_description')}
      isVisible={updateIsVisible}
      setIsVisible={onClose}
      buttons={[
        {
          title: t('update_button_done'),
          onPress: onUpdate,
        },
        {
          title: t('update_button_close'),
          onPress: onClose,
          variant: 'outline',
        },
      ]}
    />
  );
};

export default UpdateModal;
