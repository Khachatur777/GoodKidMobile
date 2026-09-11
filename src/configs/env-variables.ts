import Config from 'react-native-config';

// Feature/language is isolated from live, including release test builds.
export const useDevApi = true;

export const baseUrl = Config.RN_APP_BASE_URL;
export const baseFileUrl = Config.RN_APP_BASE_FILE_URL;
export const baseUrlDev = 'https://apidev.goodkid.app/api';
export const baseUrlIp = Config.RN_APP_BASE_URL_IP;
const configuredFileUrl = Config.RN_APP_FILE_URL;

// Картинки и звук должны лежать там же, где API. Пока файловый адрес жил
// отдельной настройкой, отладочная сборка ходила за данными на дев-стенд, а за
// файлами — на прод: совпадало, только пока файлы были одинаковыми на обеих
// машинах. Стоило переозвучить карточки — и звук пропал, потому что новых
// дорожек на проде нет. Теперь окружение выбирается один раз.
export const fileUrl = useDevApi
  ? (baseUrlDev || '').replace(/\/api\/?$/, '') || configuredFileUrl
  : configuredFileUrl;

export const purchaseKeyIos = Config.REVENUECAT_PURCHASE_KEY_IOS;
export const purchaseKeyAndroid = Config.REVENUECAT_PURCHASE_KEY_ANDROID;
export const purchaseKeyDebug = Config.REVENUECAT_PURCHASE_KEY_DEBUG;

export const googleWebClientId = Config.GOOGLE_WEB_CLIENT_ID;
export const googleIosClientId = Config.GOOGLE_IOS_CLIENT_ID;
