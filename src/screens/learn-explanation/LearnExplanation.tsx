import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import {
  BackgroundWrapper,
  Button,
  CardWrapper,
  Spacing,
  Typography,
} from 'molecules';
import { learnExplanationStyles } from './learn-explanation-styles.ts';
import { useTranslation } from 'react-i18next';
import { ILearnCategoryItem, ILearnCategoryItems } from 'models';
import {
  useGetAllLearnCategoryItemsQuery,
  useViewLearnItemsMutation,
  useViewLearnItemsResetMutation,
} from 'rtk';
import { getFileUri } from 'utils';
import i18n from 'i18next';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAudioPlayer } from 'hooks/useAudioPlayer';
import { ChangeLanguageLearnModal } from './components';

type LearnLanguage = 'ru' | 'en' | 'hy';

export interface LearnProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    {
      params: { category: ILearnCategoryItem };
    },
    'params'
  >;
}

const LearnExplanation: FC<LearnProps> = ({ route }) => {
  const { t } = useTranslation();
  const styles = useMemo(() => learnExplanationStyles(), []);
  const category = route?.params?.category;
  const { play, playing } = useAudioPlayer();

  const [activeIndex, setActiveIndex] = useState(0);
  const [changeLanguageLearnModalVisible,
    setChangeLanguageLearnModalVisible,
  ] = useState(false);
  const [learnData, setLearnData] = useState<ILearnCategoryItems[]>([]);
  const [language, setLanguage] = useState<LearnLanguage>((i18n.language || 'en').toLowerCase().startsWith('ru')
    ? 'ru'
    : (i18n.language || 'en').toLowerCase().startsWith('hy')
      ? 'hy'
      : 'en');
  const [activeLearnData, setActiveLearnData] =
    useState<ILearnCategoryItems | null>(null);
  console.log(activeLearnData);;
  const [viewLearn] = useViewLearnItemsMutation();
  const [viewLearnReset] = useViewLearnItemsResetMutation();

  const queryArg = category?._id
    ? {
        categoryId: category._id,
        limit: 100,
        showModal: true,
      }
    : skipToken;

  const { data, refetch, fulfilledTimeStamp } =
    useGetAllLearnCategoryItemsQuery(queryArg);

  useEffect(() => {
    if (data?.success && Array.isArray(data?.data) && data.data.length) {
      setLearnData(data.data);
      setActiveIndex(0);
      setActiveLearnData(data.data[0]);
    }
  }, [data?.success, data?.data, fulfilledTimeStamp]);

  const onPressVoice = useCallback(async () => {
    const audioPath = activeLearnData?.audio?.[language]?.path;
    if (!audioPath) return;

    const url = getFileUri(audioPath);

    play(url);
  }, [activeLearnData, language, play]);


  const onPressNext = useCallback(async () => {
    if (!learnData.length) return;

    const next = activeIndex + 1;

    if (next >= learnData.length) {
      try {
        await viewLearnReset({showLoader: true});
        await refetch();

      } catch (e) {

      }
      return;
    }

    try {
      await viewLearn({ knowledgeItemId: activeLearnData?._id! }).unwrap();
    } catch (e) {}

    setActiveIndex(next);
    setActiveLearnData(learnData[next]);
  }, [
    activeIndex,
    learnData,
    activeLearnData,
    viewLearn,
    viewLearnReset,
    refetch,
  ]);

  if (!data?.success) return null;

  return (
    <BackgroundWrapper containerStyles={{ paddingBottom: 80 }}>
      <CardWrapper containerStyles={styles.cardContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <TouchableOpacity
              onPress={() => setChangeLanguageLearnModalVisible(true)}
            >
              <Typography type={'caption'}>
                {t('choose_learn_language')}
              </Typography>
              <Typography>English</Typography>
            </TouchableOpacity>

            <Spacing size={12} />

            {!!activeLearnData?.images?.length && (
              <View style={styles.imgContainer}>
                {activeLearnData.images.map(img => (
                  <Image
                    key={img?.type}
                    source={{ uri: getFileUri(img?.path) }}
                    style={styles.image}
                  />
                ))}
              </View>
            )}

            <Spacing size={16} />

            <Typography type={'titleXLMedium'}>
              {activeLearnData?.title?.[language] || ''}
            </Typography>

            <Spacing size={16} />

            <Typography type={'bodyL'}>
              {activeLearnData?.description?.[language] || ''}
            </Typography>

            <Spacing size={24} />
          </View>

          <View>
            <Button
              title={t('voice_playing')}
              onPress={onPressVoice}
              startIconName={'SoundIcon'}
              disabled={!activeLearnData?.audio?.[language]?.path || playing}
            />

            <Spacing size={16} />

            <Button
              disabled={!activeLearnData?.audio?.[language]?.path || playing}
              variant={'outline'}
              title={t('next')}
              onPress={onPressNext}
            />
          </View>

          <ChangeLanguageLearnModal
            isVisible={changeLanguageLearnModalVisible}
            setIsVisible={setChangeLanguageLearnModalVisible}
            onLanguageChange={lng => {
              setLanguage(lng as LearnLanguage);
              setChangeLanguageLearnModalVisible(false);
            }}
            language={language}
          />
        </ScrollView>
      </CardWrapper>
    </BackgroundWrapper>
  );
};

export default LearnExplanation;
