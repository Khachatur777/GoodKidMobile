import i18n from 'localization/localization';
import {Modal, Spacing, Typography} from 'molecules';
import {RadioSelectCell} from 'organisms';
import {Dispatch, FC, SetStateAction, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {setLanguageId} from 'rtk';
import {languagesModalStyles} from './languages-modal-styles';
import {setItem} from "configs";

export interface ChangeLanguageModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const ChangeLanguageModal: FC<ChangeLanguageModalProps> = ({
                                                             isVisible,
                                                             setIsVisible,
                                                           }) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const onLanguageChange = useCallback(async (code: string) => {
    if (code === i18n.language) {
      setIsVisible(false);
      return;
    }

    await setItem('language', code);

    await i18n.changeLanguage(code);
    dispatch(setLanguageId(code));
    setIsVisible(false);

  }, []);

  return (
    <Modal
      type="bottom-sheet"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      contentContainerStyles={languagesModalStyles().container}>
      <Spacing size={16}/>

      <Typography type="title3">{t('language')}</Typography>

      <Spacing size={8}/>

      <RadioSelectCell
        title={t('change_language_english')}
        isActive={i18n.language === 'en'}
        onPress={() => onLanguageChange('en')}
      />

      <RadioSelectCell
        title={t('change_language_armenian')}
        isActive={i18n.language === 'hy'}
        onPress={() => onLanguageChange('hy')}
      />

      <RadioSelectCell
        title={t('change_language_russian')}
        isActive={i18n.language === 'ru'}
        onPress={() => onLanguageChange('ru')}
      />

      <Spacing size={24}/>
    </Modal>
  );
};

export default ChangeLanguageModal;
