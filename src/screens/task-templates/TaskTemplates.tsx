import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Button, Icon, Typography } from 'molecules';
import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ITaskTemplate } from 'models';
import {
  useCreateChildTaskMutation,
  useDeleteTaskTemplateMutation,
  useGetTaskTemplatesQuery,
} from 'rtk';
import { ThemeContext } from 'theme';
import { taskTemplatesStyles } from './task-templates-styles';

export interface TaskTemplatesProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { childId?: string } }, 'params'>;
}

// Tasks are one-shot and go to history when closed, so "tidy your room" would
// have to be typed out every week. A template is that typing done once, and a
// tap hands it out again.
const TaskTemplates: FC<TaskTemplatesProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => taskTemplatesStyles(color), [color]);

  const childId = route.params?.childId;

  const { data, isFetching } = useGetTaskTemplatesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createTask, { isLoading: giving }] = useCreateChildTaskMutation();
  const [deleteTemplate] = useDeleteTaskTemplateMutation();

  const templates = data?.data?.templates ?? [];

  // Выдаём сразу: шаблон для того и сохраняли, чтобы не проходить форму заново.
  // Поправить название можно на экране задачи.
  const onGive = async (template: ITaskTemplate) => {
    if (!childId || giving) return;

    const response = await createTask({
      id: childId,
      templateId: template._id,
      showLoader: true,
    });

    if ('data' in response && response.data?.success) navigation.goBack();
  };

  const renderTemplate = (template: ITaskTemplate) => (
    <Swipeable
      key={template._id}
      renderRightActions={() => (
        <Pressable
          style={styles.deleteAction}
          onPress={() => deleteTemplate({ templateId: template._id })}
        >
          <Icon name="TrashIcon" width={22} height={22} color="icon_inverted" />
          <Typography type="bodySBold" textColor="text_inverted">
            {t('tasks_delete')}
          </Typography>
        </Pressable>
      )}
    >
      <Pressable style={styles.row} onPress={() => onGive(template)}>
        <View style={styles.iconTile}>
          {template.icon ? (
            <Text style={styles.emoji}>{template.icon}</Text>
          ) : (
            <Icon name="TasksIcon" width={22} height={22} color="icon_secondary" />
          )}
        </View>

        <View style={styles.rowText}>
          <Typography type="bodyBold">{template.title}</Typography>

          <Typography type="bodyS" textColor="text_tertiary">
            {t('tasks_template_used', { count: template.usageCount })}
          </Typography>
        </View>

        <View style={styles.reward}>
          <Icon name="StarIcon" width={16} height={16} color="accent_star" />
          <Typography type="bodySBold">{String(template.stars)}</Typography>
        </View>
      </Pressable>
    </Swipeable>
  );

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        {templates.length ? (
          <>
            <View style={styles.hint}>
              <Typography type="bodyS" textColor="text_secondary">
                {t('tasks_templates_hint')}
              </Typography>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              {templates.map(renderTemplate)}
            </ScrollView>
          </>
        ) : (
          !isFetching && (
            <View style={styles.empty}>
              <View style={styles.emptyCircle}>
                <Icon name="TasksIcon" width={40} height={40} color="icon_tertiary" />
              </View>

              <Typography type="title3" alignment="center">
                {t('tasks_templates_empty_title')}
              </Typography>

              <Typography type="bodyM" textColor="text_secondary" alignment="center">
                {t('tasks_templates_empty_description')}
              </Typography>
            </View>
          )
        )}

        <View style={styles.footer}>
          <Button
            title={t('tasks_new')}
            onPress={() => navigation.navigate('TaskFormScreen', { childId })}
          />
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default TaskTemplates;
