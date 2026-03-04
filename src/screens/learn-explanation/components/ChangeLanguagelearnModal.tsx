import i18n from 'localization/localization';
import { Modal, Spacing, Typography } from 'molecules';
import { RadioSelectCell } from 'organisms';
import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { learnExplanationStyles } from '../learn-explanation-styles.ts';

export interface ChangeLanguageModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onLanguageChange: (languageId: string) => void;
  language: string;
}

const ChangeLanguageLearnModal: FC<ChangeLanguageModalProps> = ({
  isVisible,
  setIsVisible,
  onLanguageChange,
  language,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      type="bottom-sheet"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      contentContainerStyles={learnExplanationStyles().modalContainer}
    >
      <Spacing size={16} />

      <Typography type="title3">{t('language')}</Typography>

      <Spacing size={8} />

      <RadioSelectCell
        title={t('change_language_english')}
        isActive={language === 'en'}
        onPress={() => onLanguageChange('en')}
      />

      <RadioSelectCell
        title={t('change_language_armenian')}
        isActive={language === 'hy'}
        onPress={() => onLanguageChange('hy')}
      />

      <RadioSelectCell
        title={t('change_language_russian')}
        isActive={language === 'ru'}
        onPress={() => onLanguageChange('ru')}
      />

      <Spacing size={24} />
    </Modal>
  );
};

export default ChangeLanguageLearnModal;
