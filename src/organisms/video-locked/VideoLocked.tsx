import { NavigationProp } from '@react-navigation/native';
import { AlertModal, BackgroundWrapper, Button, Icon, Typography } from 'molecules';
import { FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { IVideoLockState } from 'models';
import { useUnlockVideoMutation } from 'rtk';
import { ThemeContext } from 'theme';
import { videoLockedStyles } from './video-locked-styles';

export interface VideoLockedProps {
  state: IVideoLockState;
  navigation: NavigationProp<any>;
}

const timeOfDay = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Что видит ребёнок вместо ленты. Не запрет, а цена: сколько стоит, сколько у
// него есть и где взять недостающее. Ни минусов, ни красного, ни слова
// «нельзя» — только «сколько осталось».
const VideoLocked: FC<VideoLockedProps> = ({ state, navigation }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => videoLockedStyles(color), [color]);

  const [confirming, setConfirming] = useState(false);
  const [unlock, { isLoading }] = useUnlockVideoMutation();

  const enough = state.needed === 0;
  const ratio = state.unlockCost > 0
    ? Math.min(1, state.balance / state.unlockCost)
    : 1;

  const onUnlock = async () => {
    setConfirming(false);
    await unlock();
  };

  return (
    <BackgroundWrapper backgroundColor="bg_primary" includesSafeArea>
      <View style={styles.container}>
        <View style={styles.lockCircle}>
          <Icon name="LockIcon" width={52} height={52} color="icon_secondary" />
        </View>

        <Typography type="titleL" alignment="center">
          {t('video_locked_title')}
        </Typography>

        <Typography type="bodyM" textColor="text_secondary" alignment="center">
          {enough
            ? t('video_locked_enough', { balance: state.balance })
            : t('video_locked_short', { balance: state.balance, needed: state.needed })}
        </Typography>

        {/* Полоску показываем только когда не хватает: при полном балансе она
            всегда залита и ничего не сообщает. */}
        {!enough && (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
            </View>

            <View style={styles.progressLabels}>
              <Typography type="bodyS" textColor="text_secondary">
                {t('video_locked_progress', {
                  balance: state.balance,
                  cost: state.unlockCost,
                })}
              </Typography>

              <View style={styles.progressRight}>
                <Icon name="StarIcon" width={16} height={16} color="accent_active" />
                <Typography type="bodySBold">{String(state.unlockCost)}</Typography>
              </View>
            </View>
          </View>
        )}

        <View style={styles.primaryButton}>
          {enough ? (
            <Button
              title={t('video_unlock_action', {
                hours: state.unlockHours,
                cost: state.unlockCost,
              })}
              disabled={isLoading}
              onPress={() => setConfirming(true)}
            />
          ) : (
            // Не хватает — главная кнопка ведёт зарабатывать, а не упирается в
            // недоступную оплату.
            <Button
              title={t('video_locked_earn')}
              onPress={() => navigation.navigate('TasksTab', { screen: 'KidTasksScreen' })}
            />
          )}
        </View>

        <View style={styles.secondaryRow}>
          <View style={styles.secondaryItem}>
            <Button
              variant="outline"
              title={t('tasks_kid_header')}
              onPress={() => navigation.navigate('TasksTab', { screen: 'KidTasksScreen' })}
            />
          </View>

          <View style={styles.secondaryItem}>
            <Button
              variant="outline"
              title={t('learn_tab')}
              onPress={() => navigation.navigate('LearnTab', { screen: 'SectionsScreen' })}
            />
          </View>
        </View>
      </View>

      <AlertModal
        isVisible={confirming}
        setIsVisible={setConfirming}
        title={t('video_unlock_confirm_title', {
          hours: state.unlockHours,
          cost: state.unlockCost,
        })}
        iconProps={{ name: 'StarIcon' }}
        description={
          <View style={styles.exchangeRow}>
            <View style={styles.exchangeSide}>
              <Typography type="bodyS" textColor="text_secondary">
                {t('video_unlock_now')}
              </Typography>
              <View style={styles.exchangeStars}>
                <Icon name="StarIcon" width={18} height={18} color="accent_active" />
                <Typography type="bodyBold">{String(state.balance)}</Typography>
              </View>
            </View>

            <Icon name="ChevronRight" width={20} height={20} color="icon_tertiary" />

            <View style={styles.exchangeSide}>
              <Typography type="bodyS" textColor="text_secondary">
                {t('video_unlock_left')}
              </Typography>
              <View style={styles.exchangeStars}>
                <Icon name="StarIcon" width={18} height={18} color="accent_active" />
                <Typography type="bodyBold">
                  {String(Math.max(0, state.balance - state.unlockCost))}
                </Typography>
              </View>
            </View>
          </View>
        }
        buttons={[
          {
            title: t('video_unlock_open'),
            variant: 'primary',
            onPress: onUnlock,
          },
          {
            title: t('video_unlock_not_now'),
            variant: 'outline',
            onPress: () => setConfirming(false),
          },
        ]}
      />
    </BackgroundWrapper>
  );
};

// Тонкая плашка над лентой, когда окно оплачено и идёт.
export const VideoOpenBanner: FC<{ until: string }> = ({ until }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => videoLockedStyles(color), [color]);

  return (
    <View style={styles.banner}>
      <Icon name="LockIcon" width={16} height={16} color="text_positive" />
      <Typography type="bodyS" textColor="text_secondary">
        {t('video_open_until', { time: timeOfDay(until) })}
      </Typography>
    </View>
  );
};

export default VideoLocked;
