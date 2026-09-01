import { FC, useContext, useMemo } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { BackgroundWrapper, Button, Icon, Typography } from 'molecules';
import { useTranslation } from 'react-i18next';
import { ITask } from 'models';
import {
  useGetLearningProgressQuery,
  useGetMyTasksQuery,
  useSubmitTaskMutation,
} from 'rtk';
import { ThemeContext } from 'theme';
import { kidTasksStyles } from './kid-tasks-styles';

// Задачи ставит родитель, ребёнок их закрывает. Звёзд здесь не начисляют:
// «Я сделал» только отправляет задачу на проверку, платит подтверждение
// родителя. Поэтому на этом экране нигде не написано, что звёзды уже твои.
const KidTasks: FC = () => {
  const { color } = useContext(ThemeContext);
  const { t } = useTranslation();
  const styles = useMemo(() => kidTasksStyles(color), [color]);

  const { data, isFetching, refetch } = useGetMyTasksQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: progress } = useGetLearningProgressQuery({ showModal: false });
  const [submitTask, { isLoading: submitting }] = useSubmitTaskMutation();

  const open = data?.data?.open ?? [];
  const pending = data?.data?.pending ?? [];
  const done = data?.data?.done ?? [];

  // Тратится баланс, поэтому в шапке он, а не заработанное за всё время: этим
  // числом ребёнок открывает видео.
  const balance = progress?.data?.stars?.balance ?? 0;

  const isEmpty = !open.length && !pending.length && !done.length;

  const reward = (task: ITask, muted?: boolean) => (
    <View style={[styles.reward, muted && styles.rewardOnMuted]}>
      <Icon name="StarIcon" width={16} height={16} color="accent_active" />
      <Typography type="bodySBold">
        {String(task.awardedStars ?? task.stars)}
      </Typography>
    </View>
  );

  const renderTask = (task: ITask, kind: 'open' | 'pending' | 'done') => (
    <View
      key={task._id}
      style={[styles.card, kind !== 'open' && styles.cardMuted]}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardText}>
          <Typography type="bodyBold">{task.title}</Typography>

          {!!task.description && (
            <Typography type="bodyS" textColor="text_secondary">
              {task.description}
            </Typography>
          )}
        </View>

        {reward(task, kind !== 'open')}
      </View>

      {kind === 'open' && (
        <Button
          title={t('tasks_kid_did_it')}
          size="small"
          disabled={submitting}
          onPress={() => submitTask({ taskId: task._id })}
        />
      )}

      {kind === 'pending' && (
        <View style={styles.statusRow}>
          <Icon name="RefreshIcon" width={18} height={18} color="icon_secondary" />
          <Typography type="bodyS" textColor="text_secondary">
            {t('tasks_kid_waiting')}
          </Typography>
        </View>
      )}

      {kind === 'done' && (
        <View style={styles.statusRow}>
          <Icon name="CheckMark" width={18} height={18} color="text_positive" />
          <Typography type="bodyS" textColor="text_positive">
            {t('tasks_kid_done')}
          </Typography>
        </View>
      )}
    </View>
  );

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Typography type="titleL">{t('tasks_kid_header')}</Typography>
          </View>

          <View style={styles.starsBadge}>
            <Icon name="StarIcon" width={20} height={20} color="accent_active" />
            <Typography type="bodyBold">{String(balance)}</Typography>
          </View>
        </View>

        {isEmpty ? (
          // Пусто — это не «ты ничего не сделал». Ни одной задачи ещё не выдали,
          // и упрекать ребёнка тут не за что.
          <View style={styles.empty}>
            <View style={styles.emptyCircle}>
              <Icon name="TasksIcon" width={44} height={44} color="icon_tertiary" />
            </View>

            <Typography type="title3" alignment="center">
              {t('tasks_kid_empty_title')}
            </Typography>

            <Typography type="bodyM" textColor="text_secondary" alignment="center">
              {t('tasks_kid_empty_description')}
            </Typography>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isFetching} onRefresh={refetch} />
            }
          >
            {open.map(task => renderTask(task, 'open'))}

            {!!pending.length && (
              <View style={styles.groupTitle}>
                <Typography type="captionBold" textColor="text_secondary">
                  {t('tasks_kid_waiting').toUpperCase()}
                </Typography>
              </View>
            )}
            {pending.map(task => renderTask(task, 'pending'))}

            {!!done.length && (
              <View style={styles.groupTitle}>
                <Typography type="captionBold" textColor="text_secondary">
                  {t('tasks_kid_done').toUpperCase()}
                </Typography>
              </View>
            )}
            {done.map(task => renderTask(task, 'done'))}
          </ScrollView>
        )}
      </View>
    </BackgroundWrapper>
  );
};

export default KidTasks;
