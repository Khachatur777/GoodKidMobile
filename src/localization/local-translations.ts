import i18n from './localization';

export const localTranslations = {
  en: {
    refetch_net_info: 'Refetch',
    net_info_title: 'You are offline',
    net_info_description:
      'Please, check your internet connection and refresh the page',
    enter_pin_code: 'Enter PIN code',
    pin_code_mismatch: 'Incorrect PIN code',
    DocReaderSearchingForADocument: 'Scanning is in progress',
    DocReaderHoldTheDeviceStill: 'Hold the document still in the frame',
    maintenance_title: 'Technical maintenance',
    maintenance_description:
      'Technical upgrade in progress. We will be back soon.',
  },
  ru: {
    refetch_net_info: 'Обновить',
    net_info_title: 'Сеть недоступна',
    net_info_description:
      'Проверьте подключение к интернету и перезагрузите страницу',
    enter_pin_code: 'Введите PIN-код',
    pin_code_mismatch: 'Неверный PIN-код',
    DocReaderSearchingForADocument: 'Выполняется сканирование',
    DocReaderHoldTheDeviceStill: 'Держите документ неподвижно в рамке',
    maintenance_title: 'Технические работы',
    maintenance_description:
      'В данный момент проводится техническое обновление. Мы скоро вернемся.',
  },
  hy: {
    refetch_net_info: 'Թարմացնել',
    net_info_title: 'Կապի խնդիր',
    net_info_description:
      'Խնդրում ենք ստուգել ինտերնետ հասանելիությունը և թարմացնել էջը',
    enter_pin_code: 'Մուտքագրել PIN կոդը',
    pin_code_mismatch: 'Սխալ PIN կոդ',
    DocReaderSearchingForADocument: 'Կատարվում է սքանավորում',
    DocReaderHoldTheDeviceStill: 'Փաստաթուղթն անշարժ պահել շրջանակի մեջ',
    maintenance_title: 'Տեխնիկական վերազինում',
    maintenance_description:
      'Այս պահին ընթանում են տեխնիկական արդիականացման աշխատանքներ: Մենք շուտով կվերադառնանք:',
  },
};

export const localT = (translation: keyof typeof localTranslations.en) => {
  const languageMap: Record<string, keyof typeof localTranslations> = {
    en: 'en',
    ru: 'ru',
    hy: 'hy',
  };
  const currentLang = languageMap[i18n.language] ?? 'en';
  return localTranslations[currentLang]?.[translation];
};
