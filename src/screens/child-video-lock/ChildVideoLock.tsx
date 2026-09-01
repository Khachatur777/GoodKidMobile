import { NavigationProp, RouteProp } from '@react-navigation/native';
import {
  AlertModal,
  BackgroundWrapper,
  Button,
  Icon,
  Toggle,
  Typography,
} from 'molecules';
import { ChildSelector } from 'organisms';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  getChildrenState,
  useGetChildVideoLockQuery,
  useUpdateChildVideoLockMutation,
} from 'rtk';
import { ThemeContext } from 'theme';
import { childVideoLockStyles } from './child-video-lock-styles';

const MIN_COST = 1;
const MAX_COST = 100;

export interface ChildVideoLockProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { childId?: string } }, 'params'>;
}

const timeOfDay = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Настройка принадлежит одному ребёнку, как и фильтр: старшему видео можно
// закрыть, младшему оставить открытым, и цена у каждого своя. Поэтому сверху
// селектор детей, а всё ниже относится к выбранному.
const ChildVideoLock: FC<ChildVideoLockProps> = ({ route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childVideoLockStyles(color), [color]);

  const children = useSelector(getChildrenState);
  const [childId, setChildId] = useState<string | null>(route.params?.childId ?? null);
  const [pendingChildId, setPendingChildId] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [cost, setCost] = useState(10);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!childId && children.length) setChildId(children[0].id);
  }, [childId, children]);

  const child = children.find(item => item.id === childId);

  const { data } = useGetChildVideoLockQuery(
    { id: childId as string },
    { skip: !childId, refetchOnMountOrArgChange: true },
  );
  const [updateLock, { isLoading: saving }] = useUpdateChildVideoLockMutation();

  const state = data?.data;

  // Форма встаёт на серверное состояние — но только пока родитель ничего не
  // трогал. Без этой оговорки любой фоновый перезапрос затирал бы правку прямо
  // под пальцем: переключатель возвращался бы в исходное сразу после нажатия.
  useEffect(() => {
    if (!state || dirty) return;

    setEnabled(state.enabled);
    setCost(state.unlockCost);
  }, [state, dirty]);

  // Переключение ребёнка с несохранёнными правками спрашивает — ровно как на
  // экране фильтра.
  const onSelectChild = (id: string) => {
    if (id === childId) return;
    if (dirty) return setPendingChildId(id);

    setChildId(id);
  };

  const onSave = async () => {
    if (!childId) return;

    const response = await updateLock({
      id: childId,
      enabled,
      unlockCost: cost,
      showLoader: true,
    });

    if ('data' in response && response.data?.success) setDirty(false);
  };

  const openNow = !!state?.unlockedUntil
    && new Date(state.unlockedUntil).getTime() > Date.now();

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        {children.length > 1 && (
          <View style={styles.selectorRow}>
            <ChildSelector children={children} selectedId={childId} onSelect={onSelectChild} />
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.switchRow}>
            <Icon name="LockIcon" width={24} height={24} color="icon_secondary" />

            <View style={styles.switchText}>
              <Typography type="bodyBold">{t('video_lock_switch')}</Typography>
              {!!child && (
                <Typography type="bodyS" textColor="text_secondary">
                  {t('video_lock_for_child', { name: child.name })}
                </Typography>
              )}
            </View>

            <Toggle
              value={enabled}
              onValueChange={value => {
                setEnabled(value);
                setDirty(true);
              }}
            />
          </View>

          {enabled && (
            <View style={styles.section}>
              <View style={styles.label}>
                <Typography type="captionBold" textColor="text_secondary">
                  {t('video_lock_cost').toUpperCase()}
                </Typography>
              </View>

              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepperButton}
                  disabled={cost <= MIN_COST}
                  onPress={() => {
                    setCost(prev => Math.max(MIN_COST, prev - 1));
                    setDirty(true);
                  }}
                >
                  <Typography
                    type="title3"
                    textColor={cost <= MIN_COST ? 'text_tertiary' : 'text_primary'}
                  >
                    −
                  </Typography>
                </Pressable>

                <View style={styles.stepperValue}>
                  <Icon name="StarIcon" width={22} height={22} color="accent_active" />
                  <Typography type="title3">{String(cost)}</Typography>
                </View>

                <Pressable
                  style={styles.stepperButton}
                  disabled={cost >= MAX_COST}
                  onPress={() => {
                    setCost(prev => Math.min(MAX_COST, prev + 1));
                    setDirty(true);
                  }}
                >
                  <Typography
                    type="title3"
                    textColor={cost >= MAX_COST ? 'text_tertiary' : 'text_primary'}
                  >
                    +
                  </Typography>
                </Pressable>
              </View>
            </View>
          )}

          {enabled && (
            <View style={styles.statusRow}>
              <Icon
                name="LockIcon"
                width={22}
                height={22}
                color={openNow ? 'text_positive' : 'icon_secondary'}
              />

              <View style={styles.statusText}>
                <Typography type="bodyBold">
                  {openNow && state?.unlockedUntil
                    ? t('video_open_until', { time: timeOfDay(state.unlockedUntil) })
                    : t('video_locked_title')}
                </Typography>

                {openNow && (
                  // Досрочно закрыть нельзя: сутки уже куплены звёздами, и
                  // отнять их — то же самое, что отнять звёзды.
                  <Typography type="bodyS" textColor="text_secondary">
                    {t('video_lock_paid_note')}
                  </Typography>
                )}
              </View>
            </View>
          )}

          <View style={styles.note}>
            <Icon name="InfoIcon" width={20} height={20} color="icon_secondary" />
            <View style={styles.noteText}>
              <Typography type="bodyS" textColor="text_secondary">
                {t('video_lock_hint', { hours: state?.unlockHours ?? 24 })}
              </Typography>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title={t('save')} disabled={!dirty || saving} onPress={onSave} />
        </View>
      </View>

      <AlertModal
        isVisible={!!pendingChildId}
        setIsVisible={() => setPendingChildId(null)}
        title={t('video_lock_discard_title')}
        description={t('video_lock_discard_description')}
        buttons={[
          {
            title: t('video_lock_discard_confirm'),
            variant: 'primary',
            onPress: () => {
              setChildId(pendingChildId);
              setDirty(false);
              setPendingChildId(null);
            },
          },
          {
            title: t('video_lock_discard_cancel'),
            variant: 'outline',
            onPress: () => setPendingChildId(null),
          },
        ]}
      />
    </BackgroundWrapper>
  );
};

export default ChildVideoLock;
