import {FC, useCallback, useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {CardWrapper, AlertModal} from 'molecules';
import {Cell, ChangeLanguageModal, ChangeThemeModal} from 'organisms';
import {profileStyle} from '../../profile-styles.ts';
import {useTranslation} from 'react-i18next';
import Toast from "react-native-toast-message";
import {purchaseUser} from "hooks/usePurchase.ts";
import {getSubscriptionUserState, getUserState, setSubscriptionUserData} from "rtk";
import {usePinAction} from "hooks";
import {useDispatch, useSelector} from "react-redux";

interface ProfileSettingsProps {
  navigation: NavigationProp<any>;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [languageModal, setLanguageModal] = useState<boolean>(false);
  const [themeModal, setThemeModal] = useState<boolean>(false);
  const [subscriptionInfoModalVisible, setSubscriptionInfoModalVisible] = useState<boolean>(false);
  const {startPinAction} = usePinAction();
  const dispatch = useDispatch();
  const user = useSelector(getUserState);
  const subscriptionState = useSelector(getSubscriptionUserState);

  const onLanguageChange = useCallback(() => setLanguageModal(true), []);

  const onThemeChange = useCallback(() => setThemeModal(true), []);

  const purchase = useCallback(async () => {

    const pinRes = await startPinAction();
    const pinCode = pinRes?.data;

    if (+pinCode !== user?.pinCode) {

      return setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: t('pin_code_incorrect_title'),
          text2: t('pin_code_incorrect_description'),
          onPress: () => Toast.hide(),
        });
      }, 200);
    }

    purchaseUser()
      .then(res => {
        dispatch(setSubscriptionUserData(res?.isSubscribed!))
      })
      .catch(e => {
        console.log(e, 'rrrr');
      })
  }, [])

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
        title={t('subscription')}
        onPress={() =>{
          if(subscriptionState){
            return setSubscriptionInfoModalVisible(true)
          }
          purchase()
        }}
      />

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

      <AlertModal
        title={t('you_have_subscription')}
        description={t('you_have_subscription_description')}
        isVisible={subscriptionInfoModalVisible}
        setIsVisible={setSubscriptionInfoModalVisible}
        buttons={[
          {
            title: t('close'),
            onPress: () => setSubscriptionInfoModalVisible(false),
          }
        ]}
      />


    </CardWrapper>
  );
};

export default ProfileSettings;
