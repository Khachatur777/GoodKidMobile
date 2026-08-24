import {FC, useContext, useMemo} from 'react';
import {Linking, ScrollView, Share, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {getVersion, getBuildNumber} from 'react-native-device-info';
import {BackgroundWrapper, GoodKidLogo, Typography} from 'molecules';
import {Cell, ParentGateModal} from 'organisms';
import {useTranslation} from 'react-i18next';
import {useParentGate} from 'hooks';

import {ThemeContext} from 'theme';
import {aboutStyles} from './about-styles.ts';

export interface AboutProps {
  navigation: NavigationProp<any>;
}

const SITE_URL = 'https://goodkid.app';

const About: FC<AboutProps> = () => {
  const {t} = useTranslation();
  const {color} = useContext(ThemeContext);
  const styles = useMemo(() => aboutStyles(color), [color]);

  // The screen is open to children too, so everything that leaves the app — the
  // site, rating in the store, sharing — sits behind the adult question.
  const {runBehindGate, gateProps} = useParentGate();

  const onShare = () => {
    Share.share({message: `GoodKid — ${t('about_share_message')} ${SITE_URL}`}).catch(() => null);
  };

  return (
    <BackgroundWrapper backgroundColor="bg_primary">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoBlock}>
          <GoodKidLogo size={72} variant="stacked" />
          <View style={styles.versionChip}>
            <Typography type="bodySBold" textColor="accent_active">
              {`${t('about_version')} ${getVersion()} (build ${getBuildNumber()})`}
            </Typography>
          </View>
        </View>

        <View style={styles.card}>
          <Typography type="bodyM" textStyles={styles.description}>
            {t('about_description')}
          </Typography>
        </View>

        <View style={styles.cardList}>
          <Cell
            type="icon"
            iconName="StarIcon"
            title={t('about_rate')}
            onPress={() => runBehindGate(() => Linking.openURL(SITE_URL))}
          />
          <Cell
            type="icon"
            iconName="ShareIcon"
            title={t('about_share')}
            onPress={() => runBehindGate(onShare)}
          />
          <Cell
            type="icon"
            iconName="GlobeIcon"
            title="goodkid.app"
            onPress={() => runBehindGate(() => Linking.openURL(SITE_URL))}
          />
        </View>

        <Typography type="bodyS" textColor="text_tertiary" textStyles={styles.footer}>
          {t('about_footer')}
        </Typography>
      </ScrollView>

      <ParentGateModal {...gateProps} />
    </BackgroundWrapper>
  );
};

export default About;
