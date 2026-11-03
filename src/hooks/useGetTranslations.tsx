import {getItem, setItem} from 'configs';
import i18n from 'localization/localization';
import {localTranslations} from 'localization/local-translations';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {
  getLanguageIdForRefetchTranslations,
  useGetTranslationsQuery,
} from 'rtk';

const useGetTranslations = () => {
  const getLanguageIdForRefetch = useSelector(
    getLanguageIdForRefetchTranslations,
  );

  // The language comes from i18next itself, which re-renders this hook on every
  // change. It used to be read off the instance during a render triggered by
  // the Redux languageId, and that id does not always change with the language:
  // a parent whose profile already said "en" while the app showed Russian
  // switched to English, nothing re-rendered, English was never fetched, and
  // every label showed its key.
  const {i18n: i18nInstance} = useTranslation();
  const language = i18nInstance.language;

  const {
    data: translations,
    refetch,
    isFetching,
  } = useGetTranslationsQuery(
    {
      languageId: language,
    },
    {
      skip: !language,
      refetchOnMountOrArgChange: true,
    },
  );

  const isTranslationsLoaded = !isFetching;

  // Refetch data when language is changed
  useEffect(() => {
    if (!getLanguageIdForRefetch) return;
    refetch();
  }, [getLanguageIdForRefetch]);

  useEffect(() => {
    if (!language) return;

    // Local strings are the fallback for keys the server does not have yet
    const localDefaults =
      localTranslations[language as keyof typeof localTranslations] ||
      localTranslations.en;

    // Added next to what is loaded rather than through a second i18n.init: init
    // rebuilds the store and asks the language detector again, which reads the
    // parent's stored language and could move a child off their own. The
    // changeLanguage after it is what re-renders every screen with the words.
    const install = (values?: object | null) => {
      i18n.addResourceBundle(
        language,
        'translation',
        {...localDefaults, ...values},
        true,
        true,
      );
      i18n.changeLanguage(language);
    };

    // While the new language loads, the query still holds the previous one.
    // Installing it under the new language would show the old words for a
    // moment, so only a response for the current language is applied.
    if (translations && translations.languageId === language) {
      setItem('translations', translations?.values);
      install(translations?.values);
    } else if (!translations) {
      getItem('translations')
        .then(res => {
          if (res) install(res);
        })
        .catch(() => null);
    }
  }, [translations, language]);

  return {
    isTranslationsLoaded,
  };
};

export default useGetTranslations;
