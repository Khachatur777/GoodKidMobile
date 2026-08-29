import { FC, useContext, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Icon, KidAvatar, Typography } from 'molecules';
import { KID_AVATAR_PRESETS } from 'molecules/kid-avatar/kid-avatar-presets';
import { ThemeContext } from 'theme';
import { useTranslation } from 'react-i18next';
import { useGetLearningProgressQuery, useUnlockAppearanceMutation } from 'rtk';
import { starsCardStyles } from './stars-card-styles.ts';

// Первые аватары даются всем: ребёнок должен с чего-то начать, а не смотреть
// на сетку из одних замков.
const FREE_AVATAR_COUNT = 3;

export interface StarsCardProps {
  currentAvatarId?: string | null;
}

const StarsCard: FC<StarsCardProps> = ({ currentAvatarId }) => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => starsCardStyles(color), [color]);

  const { data, refetch } = useGetLearningProgressQuery({ showModal: false });
  const [unlock, { isLoading }] = useUnlockAppearanceMutation();
  const [failed, setFailed] = useState<string | null>(null);

  const progress = data?.data;
  const total = progress?.stars?.total ?? 0;
  const balance = progress?.stars?.balance ?? 0;
  const cost = progress?.avatarUnlockCost ?? 10;
  const unlocked = progress?.unlockedAvatars ?? [];

  const locked = KID_AVATAR_PRESETS.slice(FREE_AVATAR_COUNT).filter(
    preset => !unlocked.includes(preset.id),
  );
  const toNext = Math.max(0, cost - balance);
  const ratio = cost > 0 ? Math.min(1, balance / cost) : 1;

  const onUnlock = async (id: string) => {
    if (isLoading || balance < cost) {
      setFailed(id);
      return;
    }

    try {
      await unlock({ type: 'avatar', id }).unwrap();
      setFailed(null);
      refetch();
    } catch {
      setFailed(id);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.totalRow}>
        <Icon name={'StarIcon'} width={40} height={40} color={'accent_active'} />
        <View style={styles.totalText}>
          {/* Крупным — то, чем ребёнок расплачивается. Заработанное за всё время
              стоит рядом помельче: показывать его главным числом значит спорить
              с полоской, которая считает от баланса. */}
          <Typography type="titleL" textStyles={styles.total}>{String(balance)}</Typography>
          <Typography type="bodyS" textColor="text_tertiary">
            {t('stars_balance')}
          </Typography>
        </View>

        {total !== balance && (
          <View style={styles.earnedBox}>
            <Typography type="bodyBold" textColor="text_secondary">{String(total)}</Typography>
            <Typography type="caption" textColor="text_tertiary">{t('stars_total_short')}</Typography>
          </View>
        )}
      </View>

      {locked.length > 0 && (
        <>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${ratio * 100}%` }]} />
          </View>
          <Typography type="bodyS" textColor="text_tertiary">
            {toNext > 0
              ? t('stars_to_next_avatar', { count: toNext })
              : t('stars_can_unlock')}
          </Typography>
        </>
      )}

      <View style={styles.grid}>
        {KID_AVATAR_PRESETS.map((preset, index) => {
          const isFree = index < FREE_AVATAR_COUNT;
          const isOpen = isFree || unlocked.includes(preset.id);

          return (
            <Pressable
              key={preset.id}
              style={styles.avatarSlot}
              disabled={isOpen}
              onPress={() => onUnlock(preset.id)}
            >
              <View style={!isOpen && styles.lockedOverlay}>
                <KidAvatar
                  avatarId={preset.id}
                  size={56}
                  selected={preset.id === currentAvatarId}
                />
              </View>

              {!isOpen && (
                <View style={styles.priceRow}>
                  <Icon name={'StarIcon'} width={14} height={14} color={'accent_active'} />
                  <Typography
                    type="captionBold"
                    textColor={failed === preset.id ? 'text_negative' : 'text_tertiary'}
                  >
                    {String(cost)}
                  </Typography>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default StarsCard;
