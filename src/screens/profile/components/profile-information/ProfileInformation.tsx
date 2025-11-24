import { FC, useState } from 'react';
import { CardWrapper } from 'molecules';
import {Cell, PrivacyPolicyModal, SupportModal, TermsModal} from 'organisms';
import { profileStyle } from '../../profile-styles.ts';
import { NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {Linking} from "react-native";

interface ProfileInformationProps {
  navigation: NavigationProp<any>;
}

const ProfileInformation: FC<ProfileInformationProps> = ({
                                                           navigation,
                                                         }) => {
  const [termsModal, setTermsModal] = useState<boolean>(false);
  const [supportModalVisible, setSupportModalVisible] = useState<boolean>(false);
  const [privacyModal, setPrivacyModal] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <CardWrapper
      titleProps={{
        type: 'bodyM',
        textColor: 'text_secondary',
      }}
      showArrowBtn={false}
      title={t('profile_information')}
      containerStyles={profileStyle({}).profileWrapper}>
      <Cell
        type="icon"
        iconName="MessageChatSquareIcon"
        title={t('profile_support')}
        onPress={() => setSupportModalVisible(true)}
      />

      <Cell
        type="icon"
        iconName="DocumentIcon"
        title={t('privacy_policy_conditions')}
        onPress={() => Linking.openURL('https://goodkid.app/privacy')}
      />

      <Cell
        type="icon"
        iconName="DocumentIcon"
        title={t('profile_terms_conditions')}
        onPress={() =>  Linking.openURL('https://goodkid.app/terms')}
      />

      {termsModal ?
        <TermsModal
          isVisible={termsModal}
          setIsVisible={setTermsModal}
        />
        :
        null}

      {privacyModal ?
        <PrivacyPolicyModal
          isVisible={privacyModal}
          setIsVisible={setPrivacyModal}
        />
        :
        null}

      {supportModalVisible ?
        <SupportModal
          isVisible={supportModalVisible}
          setIsVisible={setSupportModalVisible}
        />
        :
        null}

    </CardWrapper>
  );
};

export default ProfileInformation;
