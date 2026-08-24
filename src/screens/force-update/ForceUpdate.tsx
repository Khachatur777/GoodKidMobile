import { FC, useCallback, useContext, useEffect } from 'react';
import { Alert, BackHandler, Linking, View } from 'react-native';
import { BackgroundWrapper, Button, Icon, Typography } from 'molecules';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getConfigDataState, getIsChildState } from 'rtk';
import { ThemeContext } from 'theme';
import { getVersion } from 'react-native-device-info';
import { STORE_URL, versionNameFromConfig } from 'helpers';
import { forceUpdateStyles } from './force-update-styles.ts';

const ForceUpdate: FC = () => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const isChild = useSelector(getIsChildState);
  const config = useSelector(getConfigDataState);

  const styles = forceUpdateStyles({ color });
  const nextVersion = versionNameFromConfig(config);

  const openStore = useCallback(async () => {
    try {
      await Linking.openURL(STORE_URL);
    } catch {
      // The store may be missing on an emulator; nothing useful to say here
    }
  }, []);

  // The screen blocks the app, so Android's Back has to be answered explicitly
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        t('force_update_exit_title'),
        t('force_update_exit_description'),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('force_update_exit_confirm'), onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false },
      );

      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [t]);

  // A child cannot install anything: they are told to fetch a grown-up.
  if (isChild) {
    return (
      <BackgroundWrapper includesSafeArea backgroundColor="bg_primary" containerStyles={styles.container}>
        <View style={styles.kidContent}>
          <View style={styles.kidBadge}>
            <Icon name="ToolsIcon" width={120} height={120} color="yellow_700" />
          </View>

          <View style={styles.kidTexts}>
            <Typography type="titleL" alignment="center">
              {t('force_update_kid_title')}
            </Typography>
            <Typography type="bodyM" alignment="center" textColor="text_secondary">
              {t('force_update_kid_description')}
            </Typography>
          </View>
        </View>

        <View style={styles.kidFooter}>
          <Button
            size="large"
            title={t('force_update_kid_button')}
            startIconName="DownloadIcon"
            onPress={openStore}
          />
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper includesSafeArea backgroundColor="bg_primary" containerStyles={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustration}>
          <View style={styles.illustrationCircle} />
          <Icon name="SystemUpdateIcon" width={120} height={120} color="accent_active" />
        </View>

        <View style={styles.texts}>
          <Typography type="titleL">{t('force_update_title')}</Typography>
          <Typography type="bodyM" textColor="text_secondary">
            {t('force_update_description')}
          </Typography>

          <View style={styles.versions}>
            <View style={styles.chip}>
              <Typography type="bodySM" textColor="text_secondary">
                {t('force_update_current_version', { version: getVersion() })}
              </Typography>
            </View>

            {!!nextVersion && (
              <>
                <Icon name="ChevronRight" width={18} height={18} color="icon_tertiary" />
                <View style={[styles.chip, styles.chipNext]}>
                  <Typography type="bodySBold" textColor="accent_active">
                    {t('force_update_next_version', { version: nextVersion })}
                  </Typography>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          size="large"
          title={t('force_update_button')}
          startIconName="DownloadIcon"
          onPress={openStore}
        />
        <View style={styles.hint}>
          <Typography type="bodySM" alignment="center" textColor="text_secondary">
            {t('force_update_hint')}
          </Typography>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default ForceUpdate;
