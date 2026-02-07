import Purchases from "react-native-purchases";
import RevenueCatUI, {PAYWALL_RESULT} from "react-native-purchases-ui";

export interface UserSubscription {
  isSubscribed: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export interface UserSubscription {
  isSubscribed: boolean;
  plan: string | null;
  expiresAt: string | null;
}

export const checkUserSubscription = async (): Promise<UserSubscription> => {
  try {
    await Purchases.invalidateCustomerInfoCache();
    const customerInfo = await Purchases.getCustomerInfo();

    const subs = customerInfo.subscriptionsByProductIdentifier ?? {};
    const activeSub = Object.values(subs).find((s: any) => s?.isActive);

    return {
      isSubscribed: !!activeSub,
      plan: activeSub?.productIdentifier ?? null,
      expiresAt: activeSub?.expiresDate ?? null,
    };
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
