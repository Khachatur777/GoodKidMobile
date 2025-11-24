import Purchases from "react-native-purchases";
import RevenueCatUI, {PAYWALL_RESULT} from "react-native-purchases-ui";

export interface UserSubscription {
  isSubscribed: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export const checkUserSubscription = async (): Promise<UserSubscription> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();

    const entitlement = customerInfo.entitlements.active["GoodKid Pro"];

    const isSubscribed = !!entitlement?.isActive;
    const plan = entitlement?.productIdentifier ?? null;
    const expiresAt = entitlement?.expirationDate ?? null;

    return { isSubscribed, plan, expiresAt };
  } catch (error) {
    return { isSubscribed: false, plan: null, expiresAt: null };
  }
};

const checkOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    console.log('RC offerings =', JSON.stringify(offerings, null, 2));
  } catch (e) {
    console.log('RC getOfferings error', e);
  }
};

export const purchaseUser = async () => {
  try {

    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({});

    switch (paywallResult) {
      case PAYWALL_RESULT.PURCHASED:
        return { isSubscribed: true };
      case PAYWALL_RESULT.CANCELLED:
        console.log('❌ Пользователь закрыл paywall (cancel)');
        break;

      case PAYWALL_RESULT.ERROR:
        console.log('⚠️ Произошла ошибка при покупке');
        break;

      case PAYWALL_RESULT.RESTORED:
        console.log('♻️ Восстановлена предыдущая подписка');
        break;

      default:
        console.log('Неизвестный результат paywall:', paywallResult);
        break;
    }
  } catch (e) {
    console.log(e, 'testerror');

  }
}
