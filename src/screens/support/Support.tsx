import {FC, useContext, useMemo, useState} from 'react';
import {Linking, Pressable, ScrollView, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {BackgroundWrapper, Icon, Typography} from 'molecules';
import {SupportModal} from 'organisms';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from 'theme';
import {supportStyles} from './support-styles.ts';

export interface SupportProps {
  navigation: NavigationProp<any>;
}

const SUPPORT_EMAIL = 'support@goodkid.app';

const FAQ_KEYS = [
  {q: 'faq_pin_q', a: 'faq_pin_a'},
  {q: 'faq_offline_q', a: 'faq_offline_a'},
  {q: 'faq_age_q', a: 'faq_age_a'},
  {q: 'faq_report_q', a: 'faq_report_a'},
];

const Support: FC<SupportProps> = () => {
  const {t} = useTranslation();
  const {color} = useContext(ThemeContext);
  const styles = useMemo(() => supportStyles(color), [color]);

  const [chatVisible, setChatVisible] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <BackgroundWrapper backgroundColor="bg_primary">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Typography type="title3">{t('support_intro_title')}</Typography>

          <Typography type="bodyM" textStyles={styles.introDescription}>
            {t('support_intro_description')}
          </Typography>

          <View style={styles.actionsRow}>
            <Pressable
              style={styles.emailButton}
              onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            >
              <Icon name="EmailIcon" color="text_inverted" width={20} height={20} />
              <Typography type="bodyBold" textColor="text_inverted">
                {t('support_email_us')}
              </Typography>
            </Pressable>

            <Pressable style={styles.chatButton} onPress={() => setChatVisible(true)}>
              <Icon name="MessageChatSquareIcon" color="icon_primary" />
            </Pressable>
          </View>
        </View>

        <Typography type="captionBold" textColor="text_secondary" textStyles={styles.faqLabel}>
          {t('support_faq').toUpperCase()}
        </Typography>

        <View style={styles.faqCard}>
          {FAQ_KEYS.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const isLast = index === FAQ_KEYS.length - 1;

            return (
              <View key={item.q} style={!isLast && styles.faqRowBorder}>
                <Pressable
                  style={styles.faqRow}
                  onPress={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <Typography type="bodyBold" textStyles={styles.faqQuestion}>
                    {t(item.q)}
                  </Typography>
                  <View style={isExpanded ? styles.chevronUp : styles.chevronDown}>
                    <Icon
                      name="ChevronRight"
                      color={isExpanded ? 'accent_active' : 'icon_tertiary'}
                      width={20}
                      height={20}
                    />
                  </View>
                </Pressable>

                {isExpanded ? (
                  <Typography
                    type="bodyM"
                    textColor="text_secondary"
                    textStyles={styles.faqAnswer}
                  >
                    {t(item.a)}
                  </Typography>
                ) : null}
              </View>
            );
          })}
        </View>

        <View style={styles.contactCard}>
          <Icon name="EmailIcon" color="icon_secondary" />
          <View style={styles.contactTextContainer}>
            <Typography type="bodyBold">{SUPPORT_EMAIL}</Typography>
            <Typography type="bodyS" textColor="text_secondary">
              {t('support_hours')}
            </Typography>
          </View>
        </View>
      </ScrollView>

      {chatVisible ? (
        <SupportModal isVisible={chatVisible} setIsVisible={setChatVisible} />
      ) : null}
    </BackgroundWrapper>
  );
};

export default Support;
