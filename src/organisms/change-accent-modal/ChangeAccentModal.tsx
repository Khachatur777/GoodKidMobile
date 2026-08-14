import { Modal, Spacing, Typography, Icon } from 'molecules';
import { Dispatch, FC, SetStateAction, useCallback, useContext } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getAvailableAccentsState } from 'rtk';
import { ThemeContext } from 'theme';
import { changeAccentStyles } from './change-accent-styles.ts';

export interface ChangeAccentModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const ChangeAccentModal: FC<ChangeAccentModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const {accent, setAccent} = useContext(ThemeContext);
  const accents = useSelector(getAvailableAccentsState);
  const { t } = useTranslation();
  const styles = changeAccentStyles();

  const onAccentChange = useCallback((newAccent: string) => {
    setAccent(newAccent);
    setIsVisible(false);
  }, [setAccent, setIsVisible]);

  return (
    <Modal
      type="bottom-sheet"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      contentContainerStyles={styles.container}>
      <Spacing size={16} />

      <Typography type="title3">{t('app_colour')}</Typography>

      <Spacing size={4} />

      <Typography type="bodyM" textColor="text_secondary">
        {t('app_colour_information')}
      </Typography>

      <Spacing size={16} />

      <View style={styles.swatchRow}>
        {accents.map(item => {
          const isActive =
            item?.toLowerCase?.() === accent?.toLowerCase?.();

          return (
            <Pressable
              key={item}
              onPress={() => onAccentChange(item)}
              style={[
                styles.swatchOuter,
                isActive && {borderColor: item},
              ]}>
              <View style={[styles.swatch, {backgroundColor: item}]}>
                {isActive ? (
                  <Icon name="CheckMark" color="text_inverted" width={20} height={20} />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Spacing size={24} />
    </Modal>
  );
};

export default ChangeAccentModal;
