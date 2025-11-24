import {getItem, setItem} from 'configs';
import i18n from 'localization/localization';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {
  getLanguageIdForRefetchTranslations,
  useGetTranslationsQuery,
} from 'rtk';

const useGetTranslations = () => {
  const getLanguageIdForRefetch = useSelector(
    getLanguageIdForRefetchTranslations,
  );

  const {
    data: translations,
    refetch,
    isFetching,
  } = useGetTranslationsQuery(
    {
      languageId: i18n.language,
    },
    {
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
    if (translations) {

      setItem('translations', translations?.values);
      i18n.init({
        resources: {
          [i18n.language]: {
            translation: translations?.values,
          },
        },
      });
    } else {
      getItem('translations')
        .then(res => {
          if (res) {
            i18n.init({
              resources: {
                [i18n.language]: {
                  translation: res,
                },
              },
            });
          }
        })
        .catch(() => null);
    }
  }, [translations, i18n.language]);

  return {
    isTranslationsLoaded,
  };
};

export default useGetTranslations;
