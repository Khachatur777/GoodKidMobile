import {FC, useCallback, useEffect, useState} from 'react';
import {NavigationProp} from '@react-navigation/native';
import {CardWrapper, AlertModal, Typography} from 'molecules';
import {
  Cell,
  ChangeLanguageModal,
  ChangeThemeModal,
  ParentGateModal,
} from 'organisms';
import {profileStyle} from '../../profile-styles.ts';
import {useTranslation} from 'react-i18next';
import Toast from "react-native-toast-message";
import {purchaseUser} from "hooks/usePurchase.ts";
import {
  getChildrenState,
  getConfigDataState,
  getPaymentsEnabledState,
  getSubscriptionUserState,
  getUserState,
  setChildren,
  setSubscriptionUserData,
  useGetChildrenQuery,
} from "rtk";
import {useDispatch, useSelector} from "react-redux";
import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {ThemeContext} from 'theme';
import {getAvailableAccentsState} from 'rtk';
import i18n from 'i18next';

const accentDotsStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 8,
    alignItems: 'center',
  },
  dotRing: {
    padding: 2,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 999,
  },
});

interface ProfileSettingsProps {
  navigation: NavigationProp<any>;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({navigation}) => {
  const {t} = useTranslation();
  const [languageModal, setLanguageModal] = useState<boolean>(false);
  const [themeModal, setThemeModal] = useState<boolean>(false);
  const [subscriptionInfoModalVisible, setSubscriptionInfoModalVisible] = useState<boolean>(false);
  const [parentGateVisible, setParentGateVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const dispatch = useDispatch();
  const user = useSelector(getUserState);
  const subscriptionState = useSelector(getSubscriptionUserState);
  const paymentsEnabled = useSelector(getPaymentsEnabledState);
  const accents = useSelector(getAvailableAccentsState);
  const children = useSelector(getChildrenState);
  const configData = useSelector(getConfigDataState);
  // Лимит приходит с сервера: включат подписку — число поменяется без релиза
  const maxChildren = configData?.features?.maxChildren ?? 3;

  // Счётчик «2/3» рядом со строкой должен быть свежим при каждом заходе в профиль
  const {data: childrenResponse} = useGetChildrenQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (childrenResponse?.data?.children) {
      dispatch(setChildren(childrenResponse.data.children));
    }
  }, [childrenResponse?.data?.children, dispatch]);
  const {accent, themeMode} = useContext(ThemeContext);

  const languageValue =
    i18n.language === 'ru'
      ? t('change_language_russian')
      : i18n.language === 'hy'
        ? t('change_language_armenian')
        : t('change_language_english');

  const themeValue =
    themeMode === 'dark'
      ? t('theme_dark')
      : themeMode === 'light'
        ? t('theme_light')
        : t('theme_system');

  const onLanguageChange = useCallback(() => setLanguageModal(true), []);

  const onThemeChange = useCallback(() => setThemeModal(true), []);

  const openWithParentGate = (callback: () => void) => {
    setPendingAction(() => callback);
    setParentGateVisible(true);
  };

  const purchase = useCallback(async () => {

    purchaseUser()
      .then(res => {
        dispatch(setSubscriptionUserData(res?.isSubscribed!))
      })
      .catch(e => {
        console.log(e);
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
      containerStyles={profileStyle({}).profileWrapper}
    >
      {/* Раздел с данными детей открывается только через parental gate */}
      <Cell
        type="icon"
        iconName="User02Icon"
        title={t('children_title')}
        onPress={() => {
          openWithParentGate(() => navigation.navigate('ChildrenScreen'));
        }}
        renderRightContent={() => (
          <Typography type="bodyS" textColor="text_tertiary">
            {t('children_count_value', {count: children.length, max: maxChildren})}
          </Typography>
        )}
      />

      {paymentsEnabled || subscriptionState ? (
        <Cell
          type="icon"
          iconName="CreditCardDownIcon"
          title={t('subscription')}
          onPress={() => {
            openWithParentGate(() => {
              if (subscriptionState) {
                return setSubscriptionInfoModalVisible(true);
              }

              purchase();
            });
          }}
        />
      ) : null}

      <Cell
        type="icon"
        iconName="GlobeIcon02"
        title={t('profile_language')}
        onPress={onLanguageChange}
        renderRightContent={() => (
          <Typography type="bodyS" textColor="text_tertiary">
            {languageValue}
          </Typography>
        )}
      />

      <Cell
        type="icon"
        iconName="PaletteIcon"
        title={t('app_colour')}
        onPress={() => navigation.navigate('AppColourScreen')}
        renderRightContent={() => (
          <View style={accentDotsStyles.row}>
            {accents.slice(0, 3).map(item => (
              <View
                key={item}
                style={[
                  accentDotsStyles.dotRing,
                  item?.toLowerCase?.() === accent?.toLowerCase?.() && {
                    borderColor: item,
                  },
                ]}
              >
                <View style={[accentDotsStyles.dot, {backgroundColor: item}]} />
              </View>
            ))}
          </View>
        )}
      />

      <Cell
        type="icon"
        iconName="Contrast02Icon"
        title={t('profile_theme')}
        onPress={onThemeChange}
        renderRightContent={() => (
          <Typography type="bodyS" textColor="text_tertiary">
            {themeValue}
          </Typography>
        )}
      />

      <ChangeLanguageModal
        isVisible={languageModal}
        setIsVisible={setLanguageModal}
      />

      <ChangeThemeModal isVisible={themeModal} setIsVisible={setThemeModal} />

      <AlertModal
        title={t('you_have_subscription')}
        description={t('you_have_subscription_description')}
        isVisible={subscriptionInfoModalVisible}
        setIsVisible={setSubscriptionInfoModalVisible}
        buttons={[
          {
            title: t('close'),
            onPress: () => setSubscriptionInfoModalVisible(false),
          },
        ]}
      />

      <ParentGateModal
        isVisible={parentGateVisible}
        setIsVisible={setParentGateVisible}
        onSuccess={() => {
          pendingAction?.();
          setPendingAction(null);
        }}
      />
    </CardWrapper>
  );
};

export default ProfileSettings;
