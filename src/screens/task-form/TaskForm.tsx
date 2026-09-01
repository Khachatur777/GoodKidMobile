import { NavigationProp, RouteProp } from '@react-navigation/native';
import {
  BackgroundWrapper,
  Button,
  Icon,
  KeyboardAwareScrollView,
  TextField,
  Toggle,
  Typography,
} from 'molecules';
import { FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getChildrenState, useCreateChildTaskMutation } from 'rtk';
import { ThemeContext } from 'theme';
import { taskFormStyles } from './task-form-styles';

// The app's own icon set has no broom and no watering can, and a chore list needs
// far more markers than fifty interface glyphs can give. A small fixed set of
// emoji covers the usual week without shipping a single new asset.
const TASK_EMOJI = ['🧹', '🪥', '🛏️', '🌱', '🍽️', '📚', '🧸', '🐕', '👕', '🗑️', '🚲', '🎒'];

// Награда ограничена сверху и снизу теми же числами, что и на сервере.
const MIN_STARS = 1;
const MAX_STARS = 30;

export interface TaskFormProps {
  navigation: NavigationProp<any>;
  route: RouteProp<
    { params: { childId?: string; template?: { title: string; description: string; stars: number; icon: string } } },
    'params'
  >;
}

const TaskForm: FC<TaskFormProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => taskFormStyles(color), [color]);

  const children = useSelector(getChildrenState);
  const childId = route.params?.childId;
  const child = children.find(item => item.id === childId);

  // Пришли из шаблона — поля уже заполнены, но родитель ещё может их поправить.
  const template = route.params?.template;

  const [title, setTitle] = useState(template?.title ?? '');
  const [description, setDescription] = useState(template?.description ?? '');
  const [stars, setStars] = useState(template?.stars ?? 10);
  const [icon, setIcon] = useState(template?.icon ?? '');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);

  const [createTask, { isLoading }] = useCreateChildTaskMutation();

  const canSubmit = title.trim().length > 0 && !isLoading && !!childId;

  const onSubmit = async () => {
    if (!canSubmit) return;

    const response = await createTask({
      id: childId as string,
      title: title.trim(),
      description: description.trim(),
      stars,
      icon,
      saveAsTemplate,
      showLoader: true,
    });

    if ('data' in response && response.data?.success) navigation.goBack();
  };

  return (
    <BackgroundWrapper>
      <KeyboardAwareScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <TextField
            label={t('tasks_field_title')}
            value={title}
            onChangeText={setTitle}
            maxLength={80}
          />

          <TextField
            label={t('tasks_field_description')}
            value={description}
            onChangeText={setDescription}
            maxLength={200}
            multiline
          />
        </View>

        <View style={styles.section}>
          <View style={styles.label}>
            <Typography type="captionBold" textColor="text_secondary">
              {t('tasks_field_icon').toUpperCase()}
            </Typography>
          </View>

          <View style={styles.emojiRow}>
            {TASK_EMOJI.map(item => (
              <Pressable
                key={item}
                style={[styles.emojiTile, icon === item && styles.emojiTileSelected]}
                // Повторный тап снимает метку: значок необязателен.
                onPress={() => setIcon(prev => (prev === item ? '' : item))}
              >
                <Text style={styles.emoji}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.label}>
            <Typography type="captionBold" textColor="text_secondary">
              {t('tasks_field_stars').toUpperCase()}
            </Typography>
          </View>

          <View style={styles.stepper}>
            <Pressable
              style={styles.stepperButton}
              disabled={stars <= MIN_STARS}
              onPress={() => setStars(prev => Math.max(MIN_STARS, prev - 1))}
            >
              <Typography type="title3" textColor={stars <= MIN_STARS ? 'text_tertiary' : 'text_primary'}>
                −
              </Typography>
            </Pressable>

            <View style={styles.stepperValue}>
              <Icon name="StarIcon" width={22} height={22} color="accent_active" />
              <Typography type="title3">{String(stars)}</Typography>
            </View>

            <Pressable
              style={styles.stepperButton}
              disabled={stars >= MAX_STARS}
              onPress={() => setStars(prev => Math.min(MAX_STARS, prev + 1))}
            >
              <Typography type="title3" textColor={stars >= MAX_STARS ? 'text_tertiary' : 'text_primary'}>
                +
              </Typography>
            </Pressable>
          </View>

          {/* Без этой подсказки родитель ставит числа вслепую и незаметно
              обесценивает обучение. */}
          <View style={styles.note}>
            <Icon name="InfoIcon" width={20} height={20} color="icon_secondary" />
            <View style={styles.noteText}>
              <Typography type="bodyS" textColor="text_secondary">
                {t('tasks_stars_hint')}
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <Typography type="bodyBold">{t('tasks_save_template')}</Typography>
            <Typography type="bodyS" textColor="text_secondary">
              {t('tasks_save_template_hint')}
            </Typography>
          </View>

          <Toggle value={saveAsTemplate} onValueChange={setSaveAsTemplate} />
        </View>

        <View style={styles.note}>
          <Icon name="InfoIcon" width={20} height={20} color="icon_secondary" />
          <View style={styles.noteText}>
            <Typography type="bodyS" textColor="text_secondary">
              {t('tasks_one_shot_hint')}
            </Typography>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <Button
          title={t('tasks_give_to', { name: child?.name ?? '' })}
          disabled={!canSubmit}
          onPress={onSubmit}
        />
      </View>
    </BackgroundWrapper>
  );
};

export default TaskForm;
