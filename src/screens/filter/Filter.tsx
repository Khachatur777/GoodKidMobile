import {NavigationProp} from '@react-navigation/native';
import {BackgroundWrapper, Button, Spacing, Typography} from 'molecules';
import {FC, useCallback, useEffect, useState} from 'react';
import {filterStyles} from './filter-styles.ts';
import {ScrollView, View} from 'react-native';
import Badge from '../../molecules/badge/Badge.tsx';
import {t} from 'i18next';
import Toast from 'react-native-toast-message';
import {AgeFilter, CategoriesFilter, LanguageFilter} from 'app-constants/shared.ts';
import {
  getSubscriptionUserState,
  getUserState,
  isLoggedInSelector,
  setFilterData,
  setSubscriptionUserData,
  useEditFilterMutation,
  useGetFilterQuery
} from 'rtk';
import {useDispatch, useSelector} from 'react-redux';
import {NoSignIn} from 'organisms';
import {usePinAction} from 'hooks';
import {purchaseUser} from "hooks/usePurchase.ts";
import AlertModal from "../../molecules/alert-modal/AlertModal.tsx";

export interface FilterProps {
  navigation: NavigationProp<any>;
}

interface IFilterData {
  id: number;
  name: string;
  key?: string;
  check?: boolean;
}


const Filter: FC<FilterProps> = () => {
  const [subscriptionAskModalVisible, setSubscriptionAskModalVisible] = useState<boolean>(false)
  const [language, setLanguage] = useState<string>('')
  const [ages, setAges] = useState<number | null>(null)
  const [categories, setCategories] = useState<number[]>([])
  const [languageOptions, setLanguageOptions] = useState<IFilterData[]>([])
  const [ageOptions, setAgeOptions] = useState<IFilterData[]>([])
  const [categoryOptions, setCategoryOptions] = useState<IFilterData[]>([])
  const isLoggedIn = useSelector(isLoggedInSelector);
  const user = useSelector(getUserState);
  const subscriptionState = useSelector(getSubscriptionUserState);
  const {startPinAction} = usePinAction();
  const dispatch = useDispatch();

  const {data: getUserFilter} = useGetFilterQuery({showModal: true, showLoader: true}, {
    refetchOnMountOrArgChange: true,
    skip: !isLoggedIn
  },)
  const [editFilter] = useEditFilterMutation()

  useEffect(() => {
    if (getUserFilter?.success) {
      setCategories(getUserFilter?.filter?.categories)
      setAges(getUserFilter?.filter?.age)
      setLanguage(getUserFilter?.filter?.language)
    }
  }, [getUserFilter?.filter]);

  useEffect(() => {
    setAgeOptions(AgeFilter)
    setLanguageOptions(LanguageFilter)
    setCategoryOptions(CategoriesFilter)
  }, []);

  const chooseFilterLanguage = useCallback((lng: IFilterData) => {
    const selectedKey = lng.key || lng.name;
    setLanguage(prev => prev === selectedKey ? '' : selectedKey);
  }, []);

  const chooseFilterAge = useCallback((age: IFilterData) => {
    setAges(prev => prev === age.id ? null : age.id);
  }, []);

  const chooseFilter = useCallback((filter: IFilterData) => {
    setCategories(prev => {
      const isSelected = prev.includes(filter.id);
      if (isSelected) {
        return prev.filter(item => item !== filter.id);
      } else {
        return [...prev, filter.id];
      }
    });
  }, []);

  const onEditFilter = useCallback(async () => {
    try {
      if (!user?.id) return;

      const pinRes = await startPinAction();
      const pinCode = pinRes?.data;

      if (+pinCode !== user?.pinCode) {

        return setTimeout(() => {
          Toast.show({
            type: 'error',
            text1: t('pin_code_incorrect_title'),
            text2: t('pin_code_incorrect_description'),
            onPress: () => Toast.hide(),
          });
        }, 200);
      }

      const filterData = {
        categories,
        age: ages || '',
        language: language || '',
        showLoader: true,
        showModal: true
      };
      const response = await editFilter(filterData);

      if (response?.data?.success) {
        setTimeout(() => {
          Toast.show({
            type: 'info',
            text1: t('filter_change_successfully_title'),
            text2: t('filter_change_successfully_description'),
            onPress: () => Toast.hide(),
          });
          dispatch(setFilterData(response?.data?.filter))
        }, 200);
      }
    } catch (e) {
      console.error('Error saving filters:', e);
    }
  }, [ages, categories, language, user?.id, editFilter, user?.pinCode])

  const purchase = useCallback(async () => {

    const pinRes = await startPinAction();
    const pinCode = pinRes?.data;

    if (+pinCode !== user?.pinCode) {

      return setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: t('pin_code_incorrect_title'),
          text2: t('pin_code_incorrect_description'),
          onPress: () => Toast.hide(),
        });
      }, 200);
    }

    purchaseUser()
      .then(res => {
        dispatch(setSubscriptionUserData(res?.isSubscribed!))
      })
      .catch(e => {
        console.log(e, 'rrrr');
      })
  }, [])


  return (
    <BackgroundWrapper>
      {isLoggedIn ?

        <ScrollView contentContainerStyle={filterStyles().scrollContainer}>
          <View>
            <Typography type={'bodyL'}>{t('language_title')}</Typography>

            <Spacing size={16}/>

            <View style={filterStyles().filterItemsContainer}>

              {languageOptions.map((lng, index) => {

                const isSelected = language === (lng.key || lng.name);
                return (
                  <Badge
                    iconName={index === 0 || subscriptionState ? undefined : 'Lock'}
                    key={lng?.id}
                    title={t(lng?.name)}
                    size={'large'}
                    onPress={() => {
                      if (index !== 0 && !subscriptionState) {
                        return purchase()
                      }
                      chooseFilterLanguage(lng)
                    }}
                    borderWidth={isSelected ? 0 : 1}
                    backgroundColor={isSelected ? 'red_500' : undefined}
                    badgeColor={isSelected ? 'text_inverted' : undefined}
                  />
                )
              })}
            </View>

          </View>

          <Spacing size={24}/>

          <View>
            <Typography type={'bodyL'}>{t('filter_items_title')}</Typography>

            <Spacing size={16}/>

            <View style={filterStyles().filterItemsContainer}>

              {ageOptions.map((age, index) => {
                const isSelected = ages === age.id;
                return (
                  <Badge
                    iconName={index === 0 || subscriptionState ? undefined : 'Lock'}
                    key={age?.id}
                    title={`${age?.name} ${t('age')}`}
                    size={'large'}
                    onPress={() => {
                      if (index !== 0 && !subscriptionState) {
                        return purchase()
                      }
                      chooseFilterAge(age)
                    }}
                    borderWidth={isSelected ? 0 : 1}
                    backgroundColor={isSelected ? 'red_500' : undefined}
                    badgeColor={isSelected ? 'text_inverted' : undefined}
                  />
                )
              })}
            </View>
          </View>

          <View>
            <Typography type={'bodyL'}>{t('filter_items_title')}</Typography>

            <Spacing size={16}/>

            <View style={filterStyles().filterItemsContainer}>

              {categoryOptions.map((filter, index) => {
                const isSelected = categories.includes(filter.id);
                return (
                  <Badge
                    iconName={index === 0 || subscriptionState ? undefined : 'Lock'}
                    disabled={true}
                    key={filter?.id}
                    title={t(filter?.name)}
                    size={'large'}
                    onPress={() => {
                      if (index !== 0 && !subscriptionState) {
                        return purchase()
                      }
                      chooseFilter(filter)
                    }}
                    borderWidth={isSelected ? 0 : 1}
                    backgroundColor={isSelected ? 'red_500' : undefined}
                    badgeColor={isSelected ? 'text_inverted' : undefined}
                  />
                )
              })}
            </View>
          </View>

          <Spacing size={24}/>

          <Button title={t('save')} onPress={onEditFilter}/>

          <AlertModal
            title={t('subscription')}
            description={t('open_subscription')}
            isVisible={subscriptionAskModalVisible}
            setIsVisible={setSubscriptionAskModalVisible}
            buttons={[
              {
                title: t('subscription'),
                onPress: () => purchase()
              },
              {
                title: t('cancel'),
                onPress: () => setSubscriptionAskModalVisible(false),
                variant: 'outline'
              }
            ]}
          />

        </ScrollView>
        :
        <NoSignIn
          typeDescription={'filter'}
        />
      }
    </BackgroundWrapper>
  );
};

export default Filter;
