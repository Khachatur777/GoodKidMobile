import { NavigationProp, RouteProp } from '@react-navigation/native';
import {
  AlertModal,
  BackgroundWrapper,
  Button,
  Icon,
  Toggle,
  Typography,
} from 'molecules';
import { ChildSelector, timeLeft } from 'organisms';
import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
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

// An hour is the shortest window worth paying stars for; two days is the
// longest that still reads as "for a while" rather than "open".
const MIN_HOURS = 1;
const MAX_HOURS = 48;

export interface ChildVideoLockProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { childId?: string } }, 'params'>;
}

// The setting belongs to one child, like the filter: video can be closed for the
// older one and left open for the younger, each with their own price. So the
// child selector sits on top and everything below is for the selected child.
const ChildVideoLock: FC<ChildVideoLockProps> = ({ route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childVideoLockStyles(color), [color]);

  const children = useSelector(getChildrenState);
  const [childId, setChildId] = useState<string | null>(route.params?.childId ?? null);
  const [pendingChildId, setPendingChildId] = useState<string | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [cost, setCost] = useState(10);
  const [hours, setHours] = useState(24);
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

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

  // The form takes the server state, but only while the parent has not touched
  // anything. Without that, any background refetch would wipe an edit right
  // under the finger: the switch would flip back straight after the tap.
  //
  // It follows new server data only, not the end of an edit. Saving clears
  // `dirty` while the cached state still holds the old values until the
  // refetch lands; reacting to that put the previous price and hours back on
  // screen for a moment.
  useEffect(() => {
    if (!state || dirtyRef.current) return;

    setEnabled(state.enabled);
    setCost(state.unlockCost);
    setHours(state.unlockHours);
  }, [state]);

  // Switching child with unsaved edits asks first, exactly as on the filter
  // screen.
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
      unlockHours: hours,
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
                  <Icon name="StarIcon" width={22} height={22} color="accent_star" />
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
            <View style={styles.section}>
              <View style={styles.label}>
                <Typography type="captionBold" textColor="text_secondary">
                  {t('video_lock_hours').toUpperCase()}
                </Typography>
              </View>

              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepperButton}
                  disabled={hours <= MIN_HOURS}
                  onPress={() => {
                    setHours(prev => Math.max(MIN_HOURS, prev - 1));
                    setDirty(true);
                  }}
                >
                  <Typography
                    type="title3"
                    textColor={hours <= MIN_HOURS ? 'text_tertiary' : 'text_primary'}
                  >
                    −
                  </Typography>
                </Pressable>

                <View style={styles.stepperValue}>
                  {/* No icon: on the price it means stars, the set has no fitting
                      glyph for hours, and any other would read as a mistake. */}
                  <Typography type="title3">{t('video_lock_hours_value', { hours })}</Typography>
                </View>

                <Pressable
                  style={styles.stepperButton}
                  disabled={hours >= MAX_HOURS}
                  onPress={() => {
                    setHours(prev => Math.min(MAX_HOURS, prev + 1));
                    setDirty(true);
                  }}
                >
                  <Typography
                    type="title3"
                    textColor={hours >= MAX_HOURS ? 'text_tertiary' : 'text_primary'}
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
                    ? t(timeLeft(state.unlockedUntil).key, {
                        value: timeLeft(state.unlockedUntil).value,
                      })
                    : t('video_locked_title')}
                </Typography>

                {openNow && (
                  // It cannot be closed early: the window was bought with
                  // stars, and taking it away is the same as taking the stars.
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
                {t('video_lock_hint', { hours })}
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
