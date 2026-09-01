import { NavigationProp } from '@react-navigation/native';
import { BackgroundWrapper, Button, Icon, KidAvatar, Spacing, Typography } from 'molecules';
import { timeLeft } from 'organisms';
import { FC, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  getChildrenState,
  setChildren,
  useGetChildrenQuery,
  useGetPendingTasksCountQuery,
} from 'rtk';
import { BaseSkeleton } from 'organisms';
import { ThemeContext } from 'theme';
import { childrenStyles } from './children-styles';

export interface ChildrenProps {
  navigation: NavigationProp<any>;
}

// The parent's list of children. Opened from the profile after the parental gate.
const Children: FC<ChildrenProps> = ({ navigation }) => {
  const { t } = useTranslation();

  // Пушей в приложении нет: этот счётчик — единственный способ узнать, что
  // ребёнок отметил задачу выполненной.
  const { data: pending } = useGetPendingTasksCountQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childrenStyles(color), [color]);
  const dispatch = useDispatch();
  const children = useSelector(getChildrenState);

  const { data, isFetching, isError, refetch } = useGetChildrenQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data?.children) {
      dispatch(setChildren(data.data.children));
    }
  }, [data?.data?.children, dispatch]);

  // How many children are allowed is the server's call — the app does not bake in the number
  const maxChildren = data?.data?.limits?.maxChildren ?? 3;
  const isFull = children.length >= maxChildren;

  if (isError) {
    return (
      <BackgroundWrapper>
        <View style={styles.centered}>
          <Typography type="title3" alignment="center">
            {t('children_error_title')}
          </Typography>

          <Button variant="outline" title={t('children_try_again')} onPress={refetch} />
        </View>
      </BackgroundWrapper>
    );
  }

  if (isFetching && children.length === 0) {
    return (
      <BackgroundWrapper>
        <View style={styles.scrollContainer}>
          <BaseSkeleton height={132} radius={28} count={2} betweenSpace={14} />
        </View>
      </BackgroundWrapper>
    );
  }

  if (children.length === 0) {
    return (
      <BackgroundWrapper>
        <View style={styles.centered}>
          <View style={styles.emptyCircle}>
            <KidAvatar size={110} />
          </View>

          <Typography type="title3" alignment="center">
            {t('children_empty_title')}
          </Typography>

          <Typography type="bodyM" textColor="text_secondary" alignment="center">
            {t('children_empty_description')}
          </Typography>

          <Spacing size={12} />

          <Button
            title={t('children_add')}
            onPress={() => navigation.navigate('AddChildScreen')}
          />
        </View>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Typography type="bodyM" textColor="text_secondary">
          {t('children_added_of', { count: children.length, max: maxChildren })}
        </Typography>

        {children.map(child => (
          <Pressable
            key={child.id}
            style={styles.card}
            onPress={() => navigation.navigate('EditChildScreen', { childId: child.id })}
          >
            <View style={styles.cardHead}>
              <KidAvatar avatarId={child.avatar} size={60} />

              <View style={styles.cardTexts}>
                <Typography type="bodyLBold">{child.name}</Typography>

                <Typography type="bodyS" textColor="text_secondary">
                  {t('child_age_login', { age: child.age, login: child.login })}
                </Typography>
              </View>
            </View>

            <View style={styles.cardActions}>
              <View style={styles.cardAction}>
                <Button
                  variant="outline"
                  size="small"
                  title={t('children_edit')}
                  onPress={() => navigation.navigate('EditChildScreen', { childId: child.id })}
                />
              </View>

              <View style={styles.cardAction}>
                <Button
                  variant="secondary"
                  size="small"
                  title={t('children_activity')}
                  onPress={() =>
                    navigation.navigate('ChildActivityScreen', { childId: child.id })
                  }
                />
              </View>

              <View style={styles.cardAction}>
                <Button
                  variant="secondary"
                  size="small"
                  title={
                    pending?.data?.byChild?.[child.id]
                      ? `${t('tasks_parent_title')} · ${pending.data.byChild[child.id]}`
                      : t('tasks_parent_title')
                  }
                  onPress={() =>
                    navigation.navigate('ChildTasksScreen', { childId: child.id })
                  }
                />
              </View>

              <View style={styles.cardAction}>
                <Button
                  variant="secondary"
                  size="small"
                  title={t('video_lock_title')}
                  onPress={() =>
                    navigation.navigate('ChildVideoLockScreen', { childId: child.id })
                  }
                />
              </View>

              <View style={styles.cardAction}>
                <Button
                  variant="secondary"
                  size="small"
                  title={t('children_math')}
                  onPress={() =>
                    navigation.navigate('ChildMathScreen', {
                      childId: child.id,
                      childName: child.name,
                    })
                  }
                />
              </View>

              <View style={styles.cardAction}>
                <Button
                  variant="secondary"
                  size="small"
                  title={t('children_learning')}
                  onPress={() =>
                    navigation.navigate('LearningReportScreen', {
                      childId: child.id,
                      childName: child.name,
                    })
                  }
                />
              </View>
            </View>

            {/* Что происходит у ребёнка прямо сейчас: сколько звёзд и открыто ли
                видео. Оба числа приезжают вместе со списком, отдельных запросов
                нет. */}
            <View style={styles.statusRow}>
              <Icon
                name="LockIcon"
                width={18}
                height={18}
                color={child.videoLock?.locked ? 'icon_secondary' : 'text_positive'}
              />

              <View style={styles.statusText}>
                <Typography type="bodyS" textColor="text_secondary">
                  {child.videoLock?.locked
                    ? t('children_video_closed', { cost: child.videoLock.unlockCost })
                    : child.videoLock?.unlockedUntil
                      ? t(timeLeft(child.videoLock.unlockedUntil).key, {
                          value: timeLeft(child.videoLock.unlockedUntil).value,
                        })
                      : t('children_video_open')}
                </Typography>
              </View>

              <View style={styles.statusStars}>
                <Icon name="StarIcon" width={16} height={16} color="accent_active" />
                <Typography type="bodySBold">
                  {String(child.stars?.balance ?? 0)}
                </Typography>
              </View>
            </View>
          </Pressable>
        ))}

        <View style={styles.footer}>
          <Button
            title={t('children_add')}
            disabled={isFull}
            onPress={() => navigation.navigate('AddChildScreen')}
          />

          {isFull ? (
            <Typography type="bodyS" textColor="text_secondary" alignment="center">
              {t('children_limit_hint')}
            </Typography>
          ) : null}
        </View>
      </ScrollView>
    </BackgroundWrapper>
  );
};

export default Children;
