import { useCallback, useContext } from 'react';
import { Linking, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Spacing, Typography, Icon } from 'molecules';
import { getConfigDataState, getUpdateState, setUpdateIsVisibleData } from 'rtk';
import { ThemeContext } from 'theme';
import { STORE_URL, versionNameFromConfig } from 'helpers';
import { updateModalStyles } from './update-modal-styles';

const UpdateModal = () => {
  const updateIsVisible = useSelector(getUpdateState);
  const config = useSelector(getConfigDataState);
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const styles = updateModalStyles({ color });
  const version = versionNameFromConfig(config);
  const notes = config?.updateNotes ?? [];

  const onClose = useCallback(() => {
    dispatch(setUpdateIsVisibleData(false));
  }, [dispatch]);

  const onUpdate = useCallback(() => {
    Linking.openURL(STORE_URL).catch(() => {});
    dispatch(setUpdateIsVisibleData(false));
  }, [dispatch]);

  if (!updateIsVisible) return null;

  return (
    <Modal
      type="bottom-sheet"
      showGrabber
      isVisible={updateIsVisible}
      setIsVisible={onClose}>
      <View style={styles.header}>
        <View style={styles.iconTile}>
          <Icon name="SparklesIcon" width={34} height={34} color="accent_active" />
        </View>

        <Typography type="title3" alignment="center">
          {t('update_title')}
        </Typography>

        <Typography type="bodyS" alignment="center" textColor="text_secondary">
          {version ? t('update_description_version', { version }) : t('update_description')}
        </Typography>
      </View>

      {notes.length > 0 && (
        <View style={styles.notes}>
          {notes.map(note => (
            <View key={note} style={styles.note}>
              <View style={styles.bullet} />
              <Typography type="bodyS" textColor="text_secondary" style={styles.noteText}>
                {note}
              </Typography>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttons}>
        <Button size="large" title={t('update_button_done')} onPress={onUpdate} />
        <Button size="large" title={t('update_button_close')} variant="outline" onPress={onClose} />
      </View>

      <Spacing size={8} />
    </Modal>
  );
};

export default UpdateModal;
