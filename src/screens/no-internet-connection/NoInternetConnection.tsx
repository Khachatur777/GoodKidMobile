import { FC, useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { fetch as fetchNetInfo } from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { BackgroundWrapper, Button, Icon, Typography } from 'molecules';
import { localT } from 'localization';
import { setNetInfo } from 'rtk';
import { ThemeContext } from 'theme';
import { noInternetStyles } from './no-internet-styles';

// Shown over everything while the device is offline. The screen used to restart
// the whole app to re-check; now it just asks the system again, so nothing in
// progress is thrown away when the connection comes back.
const NoInternetConnection: FC = () => {
  const { color } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [checking, setChecking] = useState(false);

  const styles = noInternetStyles({ color });

  const tryAgain = useCallback(async () => {
    setChecking(true);
    try {
      const state = await fetchNetInfo();
      dispatch(setNetInfo(!!state.isConnected));
    } finally {
      setChecking(false);
    }
  }, [dispatch]);

  return (
    <BackgroundWrapper includesSafeArea backgroundColor="bg_primary" containerStyles={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustration}>
          <View style={styles.illustrationCircle} />
          <Icon name="CloudOffIcon" width={118} height={118} color="accent_active" />
        </View>

        <View style={styles.texts}>
          <Typography type="titleL">{localT('net_info_title')}</Typography>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          size="large"
          title={localT('refetch_net_info')}
          startIconName="RefreshIcon"
          isLoading={checking}
          onPress={tryAgain}
        />
      </View>
    </BackgroundWrapper>
  );
};

export default NoInternetConnection;
