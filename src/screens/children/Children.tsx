import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { BackgroundWrapper, Button, Icon, KidAvatar, Typography } from 'molecules';
import { BaseSkeleton, ParentGateModal, timeLeft } from 'organisms';
import { useParentGate } from 'hooks';
import { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { IChild } from 'models';
import {
  getChildrenState,
  setChildren,
  useGetChildrenQuery,
  useGetPendingTasksCountQuery,
} from 'rtk';
import { ThemeContext } from 'theme';
import { childrenStyles } from './children-styles';

export interface ChildrenProps {
  navigation: NavigationProp<any>;
}

// The parent's children. Each card is one child's state at a glance and opens
// their page — it used to carry six identical buttons, which gave the eye
// nothing to catch and said nothing about how the child was doing.
const Children: FC<ChildrenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childrenStyles(color), [color]);
  const dispatch = useDispatch();

  // Раздел детей закрыт родительским гейтом: вход — вкладка, поэтому вопрос
  // задаётся при первом её открытии.
  const [unlocked, setUnlocked] = useState(false);
  const { runBehindGate, gateProps } = useParentGate();

  useFocusEffect(
    useCallback(() => {
      if (!unlocked) runBehindGate(() => setUnlocked(true));
    }, [unlocked, runBehindGate]),
  );

  const children = useSelector(getChildrenState);

  const { data, isFetching, isError, refetch } = useGetChildrenQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Пушей в приложении нет: этот счётчик — единственный способ узнать, что
  // ребёнок отметил задачу выполненной.
  const { data: pending } = useGetPendingTasksCountQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data?.children) {
      dispatch(setChildren(data.data.children));
    }
  }, [data?.data?.children, dispatch]);

  // How many children are allowed is the server's call — the app does not bake
  // in the number.
  const maxChildren = data?.data?.limits?.maxChildren ?? 3;
  const isFull = children.length >= maxChildren;

  // «3 из 3» под заголовком: число знает экран, а не конфиг навигации, поэтому
  // подзаголовок ставится отсюда.
  useEffect(() => {
    navigation.setOptions({
      subtitle: t('children_count_subtitle', {count: children.length, max: maxChildren}),
    });
  }, [children.length, maxChildren, navigation, t]);

  const videoChip = (child: IChild) => {
    const lock = child.videoLock;

    if (lock?.locked) {
      return {
        icon: 'LockIcon' as const,
        tone: 'muted' as const,
        text: t('children_video_closed_short', { cost: lock.unlockCost }),
      };
    }

    // Оплаченное окно показываем остатком: «до 14:27» в 14:27 читается как
    // «уже истекло».
    if (lock?.unlockedUntil) {
      const left = timeLeft(lock.unlockedUntil);

      return {
        icon: 'LockOpenIcon' as const,
        tone: 'ok' as const,
        text: t(left.key, { value: left.value }),
      };
    }

    return {
      icon: 'LockOpenIcon' as const,
      tone: 'ok' as const,
      text: t('children_video_open'),
    };
  };

  const renderChild = (child: IChild) => {
    const waiting = pending?.data?.byChild?.[child.id] ?? 0;
    const video = videoChip(child);

    return (
      <Pressable
        key={child.id}
        style={styles.card}
        onPress={() => navigation.navigate('ChildScreen', { childId: child.id, childName: child.name })}
      >
        <View style={styles.cardTop}>
          <KidAvatar avatarId={child.avatar} size={54} />

          <View style={styles.cardText}>
            <Typography type="bodyLBold">{child.name}</Typography>
            <Typography type="bodyS" textColor="text_tertiary">
              {t('child_age_login', { age: child.age, login: child.login })}
            </Typography>
          </View>

          <View style={styles.starPill}>
            <Icon name="StarIcon" width={17} height={17} color="accent_star" />
            <Typography type="bodySBold" textColor="text_star">
              {String(child.stars?.balance ?? 0)}
            </Typography>
          </View>

          <Icon name="ChevronRight" width={22} height={22} color="icon_tertiary" />
        </View>

        <View style={styles.chipsRow}>
          <View style={[styles.chip, waiting > 0 && styles.chipAlert]}>
            <Icon
              name={waiting > 0 ? 'TasksIcon' : 'CheckMark'}
              width={19}
              height={19}
              color={waiting > 0 ? 'text_negative' : 'icon_tertiary'}
            />
            <View style={styles.chipText}>
              <Typography
                type="bodySBold"
                textColor={waiting > 0 ? 'text_negative' : 'text_secondary'}
              >
                {waiting > 0
                  ? t('children_tasks_waiting', { count: waiting })
                  : t('children_tasks_none')}
              </Typography>
            </View>
          </View>

          <View style={[styles.chip, video.tone === 'ok' && styles.chipOk]}>
            <Icon
              name={video.icon}
              width={19}
              height={19}
              color={video.tone === 'ok' ? 'text_positive' : 'icon_tertiary'}
            />
            <View style={styles.chipText}>
              <Typography
                type="bodySBold"
                textColor={video.tone === 'ok' ? 'text_positive' : 'text_secondary'}
              >
                {video.text}
              </Typography>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  if (isError) {
    return (
      <BackgroundWrapper>
        <View style={styles.empty}>
          <Typography type="title3" alignment="center">
            {t('children_error_title')}
          </Typography>
          <Button variant="outline" title={t('children_try_again')} onPress={refetch} />
        </View>

        <ParentGateModal {...gateProps} />
      </BackgroundWrapper>
    );
  }

  if (isFetching && !children.length) {
    return (
      <BackgroundWrapper>
        <View style={styles.container}>
          <BaseSkeleton height={140} radius={24} />
        </View>

        <ParentGateModal {...gateProps} />
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        {children.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyCircle}>
              <KidAvatar size={72} />
            </View>

            <Typography type="title3" alignment="center">
              {t('children_empty_title')}
            </Typography>

            <Typography type="bodyM" textColor="text_secondary" alignment="center">
              {t('children_empty_description')}
            </Typography>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          >
            {children.map(renderChild)}

            {/* Предел — это факт, а не ошибка: пунктирная рамка вместо кнопки,
                которая всё равно ничего не сделает. */}
            {isFull && (
              <View style={styles.limitBox}>
                <Icon name="UsersIcon" width={20} height={20} color="icon_tertiary" />
                <Typography type="bodyS" textColor="text_tertiary">
                  {t('children_limit_reached', { count: children.length, max: maxChildren })}
                </Typography>
              </View>
            )}
          </ScrollView>
        )}

        {!isFull && (
          <View style={styles.footer}>
            <Button
              title={t('children_add')}
              startIconName="PlusIcon"
              onPress={() => navigation.navigate('AddChildScreen')}
            />
          </View>
        )}
      </View>

      <ParentGateModal {...gateProps} />
    </BackgroundWrapper>
  );
};

export default Children;
