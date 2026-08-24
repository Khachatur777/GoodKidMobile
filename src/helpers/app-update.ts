import { Platform } from 'react-native';
import { IConfig } from 'models';

// The real listings. The store link used to point at id000000000 with
// action=write-review, so "Update now" opened nothing anyone could update from.
export const STORE_URL = Platform.select({
  ios: 'https://apps.apple.com/app/id6755148083',
  android: 'https://play.google.com/store/apps/details?id=com.goodkid',
}) as string;

const buildFromConfig = (config?: IConfig) =>
  Number(Platform.OS === 'android' ? config?.versionAppAndroid : config?.versionAppIos);

export const versionNameFromConfig = (config?: IConfig) =>
  (Platform.OS === 'android' ? config?.versionNameAndroid : config?.versionNameIos) || '';

// The comparison used to be "not equal", which also caught builds newer than the
// one in the config — a tester on an internal build was told to update to an
// older version. Only an older build asks for anything.
const isOlderThanRequired = (installed: number, config?: IConfig) => {
  const required = buildFromConfig(config);
  if (!Number.isFinite(required) || !Number.isFinite(installed)) return false;
  return installed < required;
};

export const isForceUpdateRequired = (installed: number, config?: IConfig) =>
  !!config?.forceUpdate && isOlderThanRequired(installed, config);

export const isOptionalUpdateAvailable = (installed: number, config?: IConfig) =>
  !!config?.update && isOlderThanRequired(installed, config);
