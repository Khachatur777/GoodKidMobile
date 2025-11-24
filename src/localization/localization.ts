import {getItem, setItem} from 'configs';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use({
    type: 'languageDetector',
    async: true,
    init: () => {},
    detect: async function (callback: (lang: string) => void) {
      try {
        //get stored language from Async storage
        await getItem('language').then(language => {
          if (language) {
            //if language was stored before, use this language in the app
            return callback(language);
          } else {
            //if language was not stored yet, use device's locale
            return callback('en');
          }
        });
      } catch (error) {
        if (__DEV__) {
          console.log('Error reading language', error);
        }
      }
    },
    cacheUserLanguage: async function (language: string) {
      try {
        //save a user's language choice in Async storage
        await setItem('language', language);
      } catch (error) {}
    },
  })
  .init({
    compatibilityJSON: 'v4', //To make it work for Android devices, add this line.
    resources: {},
    // debug: true,
    fallbackLng: 'en',
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
export default i18n;
