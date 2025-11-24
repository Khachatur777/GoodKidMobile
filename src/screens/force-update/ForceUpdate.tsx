import {FC, useCallback, useEffect} from 'react';
import { Alert, BackHandler, Linking, Platform } from 'react-native';
import {BackgroundWrapper, Button, Icon, Spacing, Typography} from 'molecules';
import {useTranslation} from 'react-i18next';
import { forceUpdateStyles } from './force-update-styles.ts';

const STORE_URL = Platform.select({
  ios: 'itms-apps://itunes.apple.com/app/id000000000?action=write-review',
  android: 'market://details?id=com.kidsplay',
});

const ForceUpdate: FC = () => {
  const {t} = useTranslation();

  const openStore = useCallback(async () => {
    const url = STORE_URL || '';
    if (!url) {
      return;
    }
    try {
      await Linking.openURL(url);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        'Exit App',
        'Do you want to exit?',
        [
          {
            text: 'Cancel',
            onPress: () => {
            },
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => backHandler.remove();
  }, []);

  return (
    <BackgroundWrapper
      backgroundColor="bg_primary"
      containerStyles={forceUpdateStyles({}).container}>
      <Icon name="InfoIcon" width={200} height={200} />

      <Spacing size={38} />

      <Typography type="title2" alignment="center">
        {t('force_update_title')}
      </Typography>

      <Spacing size={8} />

      <Typography alignment="center" textColor="text_secondary">
        {t('force_update_description')}
      </Typography>

      <Spacing size={32} />

      <Button title={t('force_update_button')} onPress={openStore} />
    </BackgroundWrapper>
  );
};

export default ForceUpdate;


