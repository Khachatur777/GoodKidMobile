import {FC, useCallback, useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {CardWrapper} from 'molecules';
import {Cell, ChangeLanguageModal} from 'organisms';
import {profileStyle} from '../../profile-styles.ts';
import {useTranslation} from 'react-i18next';
import ChangeThemeModal from '../../../../organisms/change-theme-modal/ChangeThemeModal.tsx';

interface ProfileSettingsProps {
  navigation: NavigationProp<any>;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [languageModal, setLanguageModal] = useState<boolean>(false);
  const [themeModal, setThemeModal] = useState<boolean>(false);

  const onLanguageChange = useCallback(() => setLanguageModal(true), []);

  const onThemeChange = useCallback(() => setThemeModal(true), []);

  return (
    <CardWrapper
      titleProps={{
        type: 'bodyM',
        textColor: 'text_secondary',
      }}
      showArrowBtn={false}
      title={t('profile_settings')}
      containerStyles={profileStyle({}).profileWrapper}>

      <Cell
        type="icon"
        iconName="GlobeIcon02"
        title={t('profile_language')}
        description={t('profile_language_information')}
        onPress={onLanguageChange}
      />

      <Cell
        type="icon"
        iconName="Contrast02Icon"
        title={t('profile_theme')}
        description={t('profile_theme_information')}
        onPress={onThemeChange}
      />

      <ChangeLanguageModal
        isVisible={languageModal}
        setIsVisible={setLanguageModal}
      />

      <ChangeThemeModal
        isVisible={themeModal}
        setIsVisible={setThemeModal}
      />
    </CardWrapper>
  );
};

export default ProfileSettings;
