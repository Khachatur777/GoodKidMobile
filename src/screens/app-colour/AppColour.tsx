import {FC, useContext, useMemo} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {BackgroundWrapper, Icon, Typography} from 'molecules';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {getAvailableAccentsState} from 'rtk';
import {ThemeContext} from 'theme';
import {appColourStyles} from './app-colour-styles.ts';

export interface AppColourProps {
  navigation: NavigationProp<any>;
}

// Colour names from design v2
const ACCENT_NAME_KEYS: {[hex: string]: string} = {
  '#6B4EE6': 'colour_grape',
  '#E14A24': 'colour_ladybug',
  '#2F6BFF': 'colour_blueberry',
  '#0F8A7E': 'colour_teal',
  '#F0417E': 'colour_bubblegum',
  '#F58A1F': 'colour_mango',
  '#3FA845': 'colour_leaf',
  '#7B8794': 'colour_slate',
};

const AppColour: FC<AppColourProps> = () => {
  const {t} = useTranslation();
  const {color, accent, setAccent} = useContext(ThemeContext);
  const accents = useSelector(getAvailableAccentsState);
  const styles = useMemo(() => appColourStyles(color), [color]);

  return (
    <BackgroundWrapper backgroundColor="bg_primary">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Typography type="bodyM" textColor="text_secondary" textStyles={styles.subtitle}>
          {t('app_colour_subtitle')}
        </Typography>

        <View style={styles.card}>
          <Typography type="captionBold" textColor="text_secondary">
            {t('app_colour_preview').toUpperCase()}
          </Typography>

          <View style={styles.previewChipsRow}>
            <View style={[styles.previewChip, styles.previewChipActive]}>
              <Typography type="bodySBold" textColor="text_inverted">
                {t('all')}
              </Typography>
            </View>
            <View style={styles.previewChip}>
              <Typography type="bodyS" textColor="text_secondary">
                {t('cartoons')}
              </Typography>
            </View>
            <View style={styles.previewChip}>
              <Typography type="bodyS" textColor="text_secondary">
                {t('songs_music')}
              </Typography>
            </View>
          </View>

          <View style={styles.previewProgressTrack}>
            <View style={styles.previewProgressFill} />
          </View>

          <View style={styles.previewButton}>
            <Icon name="SoundIcon" color="text_inverted" width={20} height={20} />
            <Typography type="bodyBold" textColor="text_inverted">
              {t('voice_playing')}
            </Typography>
          </View>
        </View>

        <View style={styles.card}>
          <Typography type="captionBold" textColor="text_secondary">
            {t('app_colour_colours').toUpperCase()}
          </Typography>

          <View style={styles.swatchGrid}>
            {accents.map(item => {
              const isActive = item?.toLowerCase?.() === accent?.toLowerCase?.();
              const nameKey = ACCENT_NAME_KEYS[item?.toUpperCase?.()] || null;

              return (
                <Pressable
                  key={item}
                  style={styles.swatchItem}
                  onPress={() => setAccent(item)}
                >
                  <View style={[styles.swatchRing, isActive && {borderColor: item}]}>
                    <View style={[styles.swatch, {backgroundColor: item}]}>
                      {isActive ? (
                        <Icon name="CheckMark" color="text_inverted" width={24} height={24} />
                      ) : null}
                    </View>
                  </View>

                  <Typography
                    type={isActive ? 'bodySBold' : 'bodyS'}
                    textColor={isActive ? 'text_primary' : 'text_secondary'}
                  >
                    {nameKey ? t(nameKey) : item}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
};

export default AppColour;
