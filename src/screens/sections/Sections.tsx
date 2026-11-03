import { FC, useContext, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IIcons } from 'assets';
import { getConfigDataState, getIsChildState, useGetLearningProgressQuery } from 'rtk';
import { sectionsStyles } from './sections-styles.ts';

type SectionKey = 'world' | 'math' | 'language' | 'logic';

interface SectionTile {
  key: SectionKey;
  icon: IIcons;
  route?: string;
}

// The sections are fixed in code: each needs its own screen. The categories
// inside come from the server and are added without a release.
const SECTIONS: SectionTile[] = [
  { key: 'world', icon: 'GlobeIcon', route: 'CardCategories' },
  { key: 'math', icon: 'DotsGridIcon', route: 'MathCategories' },
  { key: 'language', icon: 'MessageChatSquareIcon', route: 'LanguageSession' },
  { key: 'logic', icon: 'PuzzleIcon' },
];

export interface SectionsProps {
  navigation: NavigationProp<any>;
}

const Sections: FC<SectionsProps> = ({ navigation }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => sectionsStyles(color), [color]);

  // Stars belong to the child. A parent looking at the content has no counter
  // to see: a "0" next to them means nothing.
  const isChild = useSelector(getIsChildState);
  const { data } = useGetLearningProgressQuery(
    { showModal: false },
    { skip: !isChild },
  );
  const stars = data?.data?.stars?.total ?? 0;

  // The console opens and closes each section. A closed one stays in the list,
  // greyed out like a section that is still coming, so the screen keeps its
  // shape. A config from before the flags existed says nothing, and that means
  // open: an older server must not lock children out of what they had.
  const config = useSelector(getConfigDataState);
  const openSections = config?.features?.learningSections;

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

          {isChild && (
            <View style={styles.starsBadge}>
              <Icon name={'StarIcon'} width={20} height={20} color={'accent_active'} />
              <Typography type="bodyBold">{String(stars)}</Typography>
            </View>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {SECTIONS.map(section => {
            const available =
              Boolean(section.route) && openSections?.[section.key] !== false;

            return (
              <Pressable
                key={section.key}
                disabled={!available}
                style={[
                  styles.tile,
                  available ? styles.tileActive : styles.tileSoon,
                ]}
                onPress={() => available && section.route && navigation.navigate(section.route)}
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
