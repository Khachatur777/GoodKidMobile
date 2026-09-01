import { NavigationProp, RouteProp } from '@react-navigation/native';
import { AlertModal, BackgroundWrapper, Button, Icon, KidAvatar, Typography } from 'molecules';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ITask } from 'models';
import {
  getChildrenState,
  useApproveChildTaskMutation,
  useDeleteChildTaskMutation,
  useGetChildTasksQuery,
  useGetPendingTasksCountQuery,
  useReopenChildTaskMutation,
} from 'rtk';
import { ThemeContext } from 'theme';
import { childTasksStyles } from './child-tasks-styles';

export interface ChildTasksProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { childId?: string } }, 'params'>;
}

const timeOfDay = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Дни считаются в местном времени родителя: сервер присылает метку, а «сегодня»
// и «вчера» имеют смысл только в его часовом поясе.
const daysAgo = (iso: string) => {
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  return Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86400000);
};

// Tasks belong to one child, like the filter does, so the screen picks a child
// first and everything below follows that choice.
const ChildTasks: FC<ChildTasksProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childTasksStyles(color), [color]);

  const children = useSelector(getChildrenState);
  const [childId, setChildId] = useState<string | null>(route.params?.childId ?? null);
  const [confirming, setConfirming] = useState<ITask | null>(null);

  useEffect(() => {
    if (!childId && children.length) setChildId(children[0].id);
  }, [childId, children]);

  const child = children.find(item => item.id === childId);

  const { data, isFetching, refetch } = useGetChildTasksQuery(
    { id: childId as string },
    { skip: !childId, refetchOnMountOrArgChange: true },
  );
  const { data: pendingCounts } = useGetPendingTasksCountQuery();

  const [approveTask, { isLoading: approving }] = useApproveChildTaskMutation();
  const [reopenTask] = useReopenChildTaskMutation();
  const [deleteTask] = useDeleteChildTaskMutation();

  const tasks = data?.data?.tasks ?? [];
  const pending = tasks.filter(task => task.status === 'pending');
  const open = tasks.filter(task => task.status === 'open');
  const done = tasks.filter(task => task.status === 'done');

  const onApprove = async (task: ITask) => {
    setConfirming(null);
    if (childId) await approveTask({ id: childId, taskId: task._id });
  };

  const onReopen = async (task: ITask) => {
    setConfirming(null);
    if (childId) await reopenTask({ id: childId, taskId: task._id });
  };

  const reward = (value: number) => (
    <View style={styles.reward}>
      <Icon name="StarIcon" width={17} height={17} color="accent_star" />
      <Typography type="bodySBold" textColor="text_star">
        {String(value)}
      </Typography>
    </View>
  );

  const completedAt = (task: ITask) => {
    const days = task.completedAt ? daysAgo(task.completedAt) : null;

    if (days === null) return null;
    if (days === 0) return t('child_activity_today');
    if (days === 1) return t('child_activity_yesterday');

    return new Date(task.completedAt as string).toLocaleDateString([], {
      day: 'numeric',
      month: 'long',
    });
  };

  const marker = (task: ITask, done?: boolean) => (
    <View style={[styles.iconTile, done && styles.iconTileDone]}>
      {done ? (
        <Icon name="CheckMark" width={19} height={19} color="text_positive" />
      ) : task.icon ? (
        <Text style={styles.emoji}>{task.icon}</Text>
      ) : (
        <Icon name="TasksIcon" width={19} height={19} color="accent_active" />
      )}
    </View>
  );

  // Ожидающие подтверждения — единственные, с которых родитель действует,
  // поэтому у каждой своя карточка с кнопками.
  const renderPending = (task: ITask) => (
    <View key={task._id} style={styles.pendingCard}>
      <View style={styles.pendingTop}>
        <View style={styles.pendingText}>
          <Typography type="bodyBold">{task.title}</Typography>

          {!!task.submittedAt && (
            // Нейтрально: пола ребёнка в модели нет, а имя и так на плитке выше.
            <Typography type="bodyS" textColor="text_secondary">
              {t('tasks_marked_at', { time: timeOfDay(task.submittedAt) })}
            </Typography>
          )}
        </View>

        {reward(task.stars)}
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.action}>
          <Button
            title={t('tasks_approve')}
            size="small"
            disabled={approving}
            onPress={() => setConfirming(task)}
          />
        </View>
        <View style={styles.action}>
          <Button
            title={t('tasks_not_yet')}
            size="small"
            variant="outline"
            onPress={() => onReopen(task)}
          />
        </View>
      </View>
    </View>
  );

  const renderRow = (task: ITask, isLast: boolean, isDone: boolean) => (
    <Pressable
      key={task._id}
      style={[styles.row, !isLast && styles.rowDivided]}
      // Выданную задачу родитель закрывает сам, не дожидаясь ребёнка, или
      // удаляет. Выполненная — история, её не трогают.
      onPress={() => !isDone && setConfirming(task)}
    >
      {marker(task, isDone)}

      <View style={styles.rowText}>
        <Typography type="bodySBold">{task.title}</Typography>

        {!!(isDone ? completedAt(task) : task.description) && (
          <Typography type="caption" textColor="text_tertiary">
            {isDone ? (completedAt(task) as string) : task.description}
          </Typography>
        )}
      </View>

      {reward(task.awardedStars ?? task.stars)}
    </Pressable>
  );

  const group = (label: string, count?: number) => (
    <View style={styles.groupHeader}>
      <Typography type="captionBold" textColor="text_secondary">
        {label.toUpperCase()}
      </Typography>

      {!!count && (
        <View style={styles.counter}>
          <Typography type="captionBold" textColor="text_inverted">
            {String(count)}
          </Typography>
        </View>
      )}
    </View>
  );

  const isEmpty = !tasks.length;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        {children.length > 1 && (
          <View style={styles.childRow}>
            {children.map(item => {
              const waiting = pendingCounts?.data?.byChild?.[item.id] ?? 0;
              const selected = item.id === childId;

              return (
                <Pressable
                  key={item.id}
                  style={[styles.childPill, selected && styles.childPillSelected]}
                  onPress={() => setChildId(item.id)}
                >
                  <KidAvatar avatarId={item.avatar} size={34} />

                  <View style={styles.childName}>
                    <Typography
                      type={selected ? 'bodySBold' : 'bodySM'}
                      textColor={selected ? 'text_primary' : 'text_secondary'}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Typography>
                  </View>

                  {!!waiting && (
                    <View style={styles.counter}>
                      <Typography type="captionBold" textColor="text_inverted">
                        {String(waiting)}
                      </Typography>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {isEmpty && !isFetching ? (
          <View style={styles.empty}>
            <View style={styles.emptyCircle}>
              <Icon name="TasksIcon" width={40} height={40} color="icon_tertiary" />
            </View>

            <Typography type="title3" alignment="center">
              {t('tasks_parent_empty_title')}
            </Typography>

            <Typography type="bodyM" textColor="text_secondary" alignment="center">
              {t('tasks_parent_empty_description')}
            </Typography>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          >
            {!!pending.length && group(t('tasks_waiting_approval'), pending.length)}
            {pending.map(renderPending)}

            {!!open.length && (
              <>
                {group(t('tasks_given'))}
                <View style={styles.groupCard}>
                  {open.map((task, index) =>
                    renderRow(task, index === open.length - 1, false),
                  )}
                </View>
              </>
            )}

            {!!done.length && (
              <>
                {group(t('tasks_kid_done'))}
                <View style={styles.groupCard}>
                  {done.map((task, index) =>
                    renderRow(task, index === done.length - 1, true),
                  )}
                </View>
              </>
            )}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <Button
            title={t('tasks_new')}
            startIconName="PlusIcon"
            onPress={() => navigation.navigate('TaskFormScreen', { childId })}
          />
        </View>
      </View>

      <AlertModal
        isVisible={!!confirming}
        setIsVisible={() => setConfirming(null)}
        title={confirming?.title}
        description={t('tasks_approve_description', {
          name: child?.name ?? '',
          stars: confirming?.stars ?? 0,
        })}
        iconProps={{ name: 'StarIcon', color: 'accent_star' }}
        buttons={[
          {
            title: t('tasks_approve_confirm', { stars: confirming?.stars ?? 0 }),
            variant: 'primary',
            onPress: () => confirming && onApprove(confirming),
          },
          {
            title: t('tasks_not_yet'),
            variant: 'outline',
            onPress: () => confirming && onReopen(confirming),
          },
          {
            title: t('tasks_delete'),
            variant: 'outline',
            onPress: () => {
              if (childId && confirming) deleteTask({ id: childId, taskId: confirming._id });
              setConfirming(null);
            },
          },
        ]}
      />
    </BackgroundWrapper>
  );
};

export default ChildTasks;
