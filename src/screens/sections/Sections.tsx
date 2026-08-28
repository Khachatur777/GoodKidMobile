import { FC, useContext, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { IIcons } from 'assets';
import { useGetLearningProgressQuery } from 'rtk';
import { sectionsStyles } from './sections-styles.ts';

type SectionKey = 'world' | 'math' | 'language' | 'logic';

interface SectionTile {
  key: SectionKey;
  icon: IIcons;
  route?: string;
}

// Разделы фиксированы в коде: под каждый нужен свой экран. Категории внутри
// приходят с сервера и добавляются без релиза.
const SECTIONS: SectionTile[] = [
  { key: 'world', icon: 'GlobeIcon', route: 'LearnScreen' },
  { key: 'math', icon: 'DotsGridIcon', route: 'MathCategories' },
  { key: 'language', icon: 'MessageChatSquareIcon' },
  { key: 'logic', icon: 'PuzzleIcon' },
];

export interface SectionsProps {
  navigation: NavigationProp<any>;
}

const Sections: FC<SectionsProps> = ({ navigation }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => sectionsStyles(color), [color]);

  const { data } = useGetLearningProgressQuery({ showModal: false });
  const stars = data?.data?.stars?.total ?? 0;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Typography type="titleL">{t('sections_title')}</Typography>
            <Typography type="bodyS" textColor="text_tertiary">
              {t('sections_subtitle')}
            </Typography>
          </View>

          <View style={styles.starsBadge}>
            <Icon name={'StarIcon'} width={20} height={20} color={'accent_active'} />
            <Typography type="bodyBold">{String(stars)}</Typography>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {SECTIONS.map(section => {
            const available = Boolean(section.route);

            return (
              <Pressable
                key={section.key}
                disabled={!available}
                style={[
                  styles.tile,
                  available ? styles.tileActive : styles.tileSoon,
                ]}
                onPress={() => section.route && navigation.navigate(section.route)}
              >
                <View style={styles.iconBox}>
                  <Icon
                    name={section.icon}
                    width={44}
                    height={44}
                    color={available ? 'accent_active' : 'icon_tertiary'}
                  />
                </View>

                <View style={styles.tileText}>
                  <Typography type="title2">{t(`section_${section.key}`)}</Typography>
                  <Typography type="bodyS" textColor="text_tertiary">
                    {available ? t(`section_${section.key}_hint`) : t('section_soon')}
                  </Typography>
                </View>

                {available && (
                  <Icon name={'ChevronRight'} width={26} height={26} color={'icon_tertiary'} />
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
};

export default Sections;
