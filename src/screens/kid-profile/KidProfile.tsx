import { NavigationProp } from '@react-navigation/native';
import { AlertModal, BackgroundWrapper, CardWrapper, KidAvatar, Typography } from 'molecules';
import { Cell, ChangeThemeModal } from 'organisms';
import { FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getAvailableAccentsState, getUserState } from 'rtk';
import { signOut } from 'helpers';
import { ThemeContext } from 'theme';
import { kidProfileStyles } from './kid-profile-styles';

export interface KidProfileProps {
  navigation: NavigationProp<any>;
}

// Детский профиль: карточка ребёнка (только чтение), тема, цвет, About и выход.
// Языка здесь нет — его задаёт родитель. Удаления аккаунта и поддержки тоже нет.
const KidProfile: FC<KidProfileProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { color, accent, themeMode } = useContext(ThemeContext);
  const styles = useMemo(() => kidProfileStyles(color), [color]);
  const user = useSelector(getUserState);
  const accents = useSelector(getAvailableAccentsState);

  const [themeModal, setThemeModal] = useState(false);
  const [logOutVisible, setLogOutVisible] = useState(false);

  const themeValue =
    themeMode === 'dark'
      ? t('theme_dark')
      : themeMode === 'light'
        ? t('theme_light')
        : t('theme_system');

  return (
    <BackgroundWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.wrapper}>
          <View style={styles.userCard}>
            <KidAvatar avatarId={user?.avatar} size={96} />

            <Typography type="title2">{user?.name}</Typography>

            <View style={styles.pillsRow}>
              <View style={[styles.pill, styles.accentPill]}>
                <Typography type="bodyS" textColor="text_primary">
                  {t('kid_age_pill', { age: user?.age })}
                </Typography>
              </View>

              <View style={[styles.pill, styles.mutedPill]}>
                <Typography type="bodyS" textColor="text_secondary">
                  {user?.login}
                </Typography>
              </View>
            </View>
          </View>

          <CardWrapper showArrowBtn={false}>
            <Cell
              type="icon"
              iconName="Moon01Icon"
              title={t('profile_theme')}
              onPress={() => setThemeModal(true)}
              renderRightContent={() => (
                <Typography type="bodyS" textColor="text_tertiary">
                  {themeValue}
                </Typography>
              )}
            />

            <Cell
              type="icon"
              iconName="PaletteIcon"
              title={t('app_colour')}
              onPress={() => navigation.navigate('AppColourScreen')}
              renderRightContent={() => (
                <View style={styles.accentDotsRow}>
                  {accents.slice(0, 3).map(item => (
                    <View
                      key={item}
                      style={[
                        styles.accentDot,
                        { backgroundColor: item },
                        item === accent ? styles.accentDotSelected : null,
                      ]}
                    />
                  ))}
                </View>
              )}
            />

            <Cell
              type="icon"
              iconName="InformationCircleIcon"
              title={t('about_app')}
              onPress={() => navigation.navigate('AboutScreen')}
            />
          </CardWrapper>

          <CardWrapper showArrowBtn={false}>
            <Cell
              type="icon"
              iconName="LogOut01Icon"
              title={t('profile_log_out')}
              showArrowIcon={false}
              onPress={() => setLogOutVisible(true)}
            />
          </CardWrapper>
        </View>
      </ScrollView>

      <ChangeThemeModal isVisible={themeModal} setIsVisible={setThemeModal} />

      <AlertModal
        isVisible={logOutVisible}
        setIsVisible={setLogOutVisible}
        title={t('kid_log_out_title')}
        description={t('kid_log_out_description')}
        iconProps={{ color: 'icon_tertiary', name: 'LogOut01Icon' }}
        buttons={[
          {
            title: t('kid_log_out_btn'),
            variant: 'primary',
            onPress: signOut,
          },
          {
            title: t('profile_log_out_cancel_btn'),
            variant: 'secondary',
            onPress: () => setLogOutVisible(false),
          },
        ]}
      />
    </BackgroundWrapper>
  );
};

export default KidProfile;
