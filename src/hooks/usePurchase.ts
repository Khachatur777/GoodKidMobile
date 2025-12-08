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


export const purchaseUser = async () => {
  try {

    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({});

    switch (paywallResult) {
      case PAYWALL_RESULT.PURCHASED:
        return { isSubscribed: true };
      case PAYWALL_RESULT.CANCELLED:
        break;

      case PAYWALL_RESULT.ERROR:
        break;

      case PAYWALL_RESULT.RESTORED:
        break;

      default:
        break;
    }
  } catch (e) {
    console.log(e, 'testerror');

  }
}
