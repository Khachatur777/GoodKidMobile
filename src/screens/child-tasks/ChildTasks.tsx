import { NavigationProp, RouteProp } from '@react-navigation/native';
import { AlertModal, BackgroundWrapper, Button, Icon, Typography } from 'molecules';
import { ChildSelector } from 'organisms';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ITask } from 'models';
import {
  getChildrenState,
  useApproveChildTaskMutation,
  useDeleteChildTaskMutation,
  useGetChildTasksQuery,
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

// Tasks belong to one child, like the filter does, so the screen picks a child
// first and everything below follows that choice.
const ChildTasks: FC<ChildTasksProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childTasksStyles(color), [color]);

  const children = useSelector(getChildrenState);
  const [childId, setChildId] = useState<string | null>(route.params?.childId ?? null);
  const [confirming, setConfirming] = useState<ITask | null>(null);

  // Opened from the profile without a child in the route — start on the first.
  useEffect(() => {
    if (!childId && children.length) setChildId(children[0].id);
  }, [childId, children]);

  const child = children.find(item => item.id === childId);

  const { data, isFetching, refetch } = useGetChildTasksQuery(
    { id: childId as string },
    { skip: !childId, refetchOnMountOrArgChange: true },
  );

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

  const renderTask = (task: ITask, kind: 'pending' | 'open' | 'done') => (
    <View key={task._id} style={[styles.card, kind === 'done' && styles.cardMuted]}>
      <View style={styles.cardTop}>
        <View style={[styles.iconTile, kind === 'done' && styles.iconTileOnMuted]}>
          {task.icon ? (
            <Text style={styles.emoji}>{task.icon}</Text>
          ) : (
            <Icon name="TasksIcon" width={22} height={22} color="icon_secondary" />
          )}
        </View>

        <View style={styles.cardText}>
          <Typography type="bodyBold">{task.title}</Typography>

          {kind === 'pending' && !!task.submittedAt && (
            // Neutral wording on purpose: the model holds no gender for a child,
            // and a kids' app is the last place to start collecting one.
            <Typography type="bodyS" textColor="text_secondary">
              {t('tasks_marked_at', { time: timeOfDay(task.submittedAt) })}
            </Typography>
          )}

          {kind === 'open' && !!task.description && (
            <Typography type="bodyS" textColor="text_secondary">
              {task.description}
            </Typography>
          )}
        </View>

        <View style={[styles.reward, kind === 'done' && styles.rewardOnMuted]}>
          <Icon name="StarIcon" width={16} height={16} color="accent_active" />
          <Typography type="bodySBold">
            {String(task.awardedStars ?? task.stars)}
          </Typography>
        </View>
      </View>

      {kind === 'pending' && (
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
      )}

      {kind === 'open' && (
        <View style={styles.actionsRow}>
          <View style={styles.action}>
            <Button
              title={t('tasks_approve')}
              size="small"
              variant="outline"
              disabled={approving}
              onPress={() => setConfirming(task)}
            />
          </View>
          <View style={styles.action}>
            <Button
              title={t('tasks_delete')}
              size="small"
              variant="outline"
              onPress={() => childId && deleteTask({ id: childId, taskId: task._id })}
            />
          </View>
        </View>
      )}
    </View>
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
          <View style={styles.selectorRow}>
            <ChildSelector children={children} selectedId={childId} onSelect={setChildId} />
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
            {pending.map(task => renderTask(task, 'pending'))}

            {!!open.length && group(t('tasks_given'))}
            {open.map(task => renderTask(task, 'open'))}

            {!!done.length && group(t('tasks_kid_done'))}
            {done.map(task => renderTask(task, 'done'))}
          </ScrollView>
        )}

        <View style={styles.footer}>
          <View style={styles.footerMain}>
            <Button
              title={t('tasks_new')}
              onPress={() => navigation.navigate('TaskFormScreen', { childId })}
            />
          </View>

          <Button
            title={t('tasks_from_template')}
            variant="outline"
            onPress={() => navigation.navigate('TaskTemplatesScreen', { childId })}
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
        iconProps={{ name: 'StarIcon' }}
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
        ]}
      />
    </BackgroundWrapper>
  );
};

export default ChildTasks;
