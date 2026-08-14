import { Modal, Spacing, Typography } from 'molecules';
import { RadioSelectCell } from 'organisms';
import { Dispatch, FC, SetStateAction, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { languagesThemeStyles } from './languages-theme-styles.ts';
import { ThemeContext } from 'theme';

export interface ChangeThemeModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const ChangeThemeModal: FC<ChangeThemeModalProps> = ({
                                                             isVisible,
                                                             setIsVisible,
                                                           }) => {
  const {themeMode, toggleTheme, useSystemTheme} = useContext(ThemeContext);
  const { t } = useTranslation();

  const onThemeChange = useCallback((id: any) => {
    toggleTheme(id);
    setIsVisible(false)
  }, []);

  const onSystemTheme = useCallback(() => {
    useSystemTheme();
    setIsVisible(false)
  }, []);

  return (
    <Modal
      type="bottom-sheet"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      contentContainerStyles={languagesThemeStyles().container}>
      <Spacing size={16} />

      <Typography type="title3">{t('theme_title')}</Typography>

      <Spacing size={8} />

      <RadioSelectCell
        title={t('theme_dark')}
        isActive={themeMode === 'dark'}
        onPress={() => onThemeChange('dark')}
      />

      <RadioSelectCell
        title={t('theme_light')}
        isActive={themeMode === 'light'}
        onPress={() => onThemeChange('light')}
      />

      <RadioSelectCell
        title={t('theme_system')}
        isActive={themeMode === 'system'}
        onPress={onSystemTheme}
      />

      <Spacing size={24} />
    </Modal>
  );
};

export default ChangeThemeModal;
