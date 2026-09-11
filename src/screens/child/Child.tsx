import { NavigationProp, RouteProp } from '@react-navigation/native';
import { BackgroundWrapper, Icon, KidAvatar, Typography } from 'molecules';
import { timeLeft } from 'organisms';
import { FC, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { IIcons } from 'assets';
import {
  getChildrenState,
  useGetLearningReportQuery,
  useGetPendingTasksCountQuery,
} from 'rtk';
import { ThemeContext } from 'theme';
import { childStyles } from './child-styles';

export interface ChildProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { childId: string } }, 'params'>;
}

// Дни считаются в местном времени родителя: сервер присылает метку, а «сегодня»
// имеет смысл только в его часовом поясе.
const daysAgo = (iso: string) => {
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  return Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / 86400000);
};

// Одна страница ребёнка вместо шести одинаковых кнопок на карточке. Наверху —
// то, что требует внимания, ниже — учёба; у каждой строки значение справа,
// поэтому родителю не нужно открывать раздел, чтобы узнать, что там.
const Child: FC<ChildProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childStyles(color), [color]);

  const childId = route.params?.childId;
  const children = useSelector(getChildrenState);
  const child = children.find(item => item.id === childId);

  const { data: pending } = useGetPendingTasksCountQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: report } = useGetLearningReportQuery(
    { childId },
    { skip: !childId, refetchOnMountOrArgChange: true },
  );

  const waiting = pending?.data?.byChild?.[childId] ?? 0;
  const lock = child?.videoLock;

  // Все три значения считаются из одного отчёта — отдельных запросов на строку
  // экран не делает.
  const learning = useMemo(() => {
    const rows = report?.data?.categories ?? [];
    const math = rows.filter(row => row.source === 'math');
    const answered = math.reduce((sum, row) => sum + row.answered, 0);
    const correct = math.reduce((sum, row) => sum + row.correctFirstTry, 0);

    return {
      mathRate: answered > 0 ? Math.round((correct / answered) * 100) : null,
      cardsDone: rows.filter(row => row.source === 'cards').length,
      cardsTotal: report?.data?.totals?.cardCategories ?? 0,
      lastActivityAt: report?.data?.lastActivityAt ?? null,
    };
  }, [report]);

  const activityValue = () => {
    if (!learning.lastActivityAt) return t('child_activity_never');

    const days = daysAgo(learning.lastActivityAt);

    if (days === 0) return t('child_activity_today');
    if (days === 1) return t('child_activity_yesterday');

    return new Date(learning.lastActivityAt).toLocaleDateString([], {
      day: 'numeric',
      month: 'long',
    });
  };

  const videoSubtitle = () => {
    if (lock?.locked)
      return t('child_video_closed', { cost: lock.unlockCost, hours: lock.unlockHours });

    if (lock?.unlockedUntil) {
      const left = timeLeft(lock.unlockedUntil);

      return `${t(left.key, { value: left.value })} · ${t('child_video_price', {
        cost: lock?.unlockCost ?? 0,
      })}`;
    }

    return t('children_video_open');
  };

  const row = (
    {
      icon,
      glyph,
      tone,
      title,
      subtitle,
      value,
      badge,
      onPress,
      last,
    }: {
      // У «Математики» в макете не иконка, а знаки «+−» — набор приложения
      // такого глифа не содержит, да и рисовать его иконкой незачем.
      icon?: IIcons;
      glyph?: string;
      tone?: 'alert' | 'ok' | 'muted';
      title: string;
      subtitle?: string | null;
      value?: string | null;
      badge?: number;
      onPress: () => void;
      last?: boolean;
    },
  ) => (
    <Pressable style={[styles.row, !last && styles.rowDivided]} onPress={onPress}>
      <View
        style={[
          styles.tile,
          tone === 'alert' && styles.tileAlert,
          tone === 'ok' && styles.tileOk,
        ]}
      >
        {glyph ? (
          <Text style={styles.glyph}>{glyph}</Text>
        ) : (
          <Icon
            name={icon as IIcons}
            width={20}
            height={20}
            color={
              tone === 'alert'
                ? 'text_negative'
                : tone === 'ok'
                  ? 'text_positive'
                  : tone === 'muted'
                    ? 'icon_secondary'
                    : 'accent_active'
            }
          />
        )}
      </View>

      <View style={styles.rowText}>
        <Typography type="bodySBold">{title}</Typography>

        {!!subtitle && (
          <Typography
            type="caption"
            textColor={tone === 'alert' ? 'text_negative' : 'text_tertiary'}
          >
            {subtitle}
          </Typography>
        )}
      </View>

      <View style={styles.rowValue}>
        {!!value && (
          <Typography type="bodyS" textColor="text_tertiary">
            {value}
          </Typography>
        )}

        {!!badge && (
          <View style={styles.counter}>
            <Typography type="captionBold" textColor="text_inverted">
              {String(badge)}
            </Typography>
          </View>
        )}

        <Icon name="ChevronRight" width={20} height={20} color="icon_tertiary" />
      </View>
    </Pressable>
  );

  if (!child) return <BackgroundWrapper><View style={styles.container} /></BackgroundWrapper>;

  return (
    <BackgroundWrapper>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <KidAvatar avatarId={child.avatar} size={64} />

            <View style={styles.headerText}>
              <Typography type="title3">{child.name}</Typography>
              <Typography type="bodyS" textColor="text_tertiary">
                {t('child_age_login', { age: child.age, login: child.login })}
              </Typography>
            </View>

            <View style={styles.balance}>
              <View style={styles.balanceValue}>
                <Icon name="StarIcon" width={22} height={22} color="accent_star" />
                <Typography type="title3">{String(child.stars?.balance ?? 0)}</Typography>
              </View>
              <Typography type="caption" textColor="text_tertiary">
                {t('child_balance')}
              </Typography>
            </View>
          </View>

          <View style={styles.groupTitle}>
            <Typography type="captionBold" textColor="text_secondary">
              {t('child_needs_attention').toUpperCase()}
            </Typography>
          </View>

          <View style={styles.groupCard}>
            {row({
              icon: 'TasksIcon',
              tone: waiting > 0 ? 'alert' : undefined,
              title: t('tasks_parent_title'),
              subtitle: waiting > 0 ? t('child_tasks_waiting', { count: waiting }) : null,
              badge: waiting || undefined,
              onPress: () => navigation.navigate('ChildTasksScreen', { childId }),
            })}

            {row({
              icon: lock?.locked ? 'LockIcon' : 'LockOpenIcon',
              // Закрытое видео — не повод для акцента: родитель сам его закрыл.
              // Тот же нейтральный тон, что у плашки в списке.
              tone: lock?.locked ? 'muted' : 'ok',
              title: t('video_lock_title'),
              subtitle: videoSubtitle(),
              onPress: () => navigation.navigate('ChildVideoLockScreen', { childId }),
              last: true,
            })}
          </View>

          <View style={styles.groupTitle}>
            <Typography type="captionBold" textColor="text_secondary">
              {t('child_learning').toUpperCase()}
            </Typography>
          </View>

          <View style={styles.groupCard}>
            {row({
              icon: 'TimelineIcon',
              title: t('children_activity'),
              value: activityValue(),
              onPress: () => navigation.navigate('ChildActivityScreen', { childId }),
            })}

            {row({
              icon: 'MessageChatSquareIcon',
              title: t('section_language'),
              value: '',
              onPress: () => navigation.navigate('ChildLanguageScreen', {childId}),
            })}

            {row({
              glyph: '+−',
              title: t('children_math'),
              value: learning.mathRate === null ? '—' : `${learning.mathRate}%`,
              onPress: () =>
                navigation.navigate('ChildMathScreen', { childId, childName: child.name }),
            })}

            {row({
              icon: 'PuzzleIcon',
              title: t('children_learning'),
              // «1 из 0» читается как поломка. Пока сервер не отдал общее число —
              // старая сборка или категорий нет вовсе — показываем только
              // пройденное.
              value: learning.cardsTotal > 0
                ? t('child_cards_progress', {
                    done: learning.cardsDone,
                    total: learning.cardsTotal,
                  })
                : String(learning.cardsDone),
              onPress: () =>
                navigation.navigate('LearningReportScreen', { childId, childName: child.name }),
              last: true,
            })}
          </View>

          <View style={styles.groupCard}>
            {row({
              icon: 'ManageAccountsIcon',
              tone: 'muted',
              title: t('child_profile_and_password'),
              onPress: () => navigation.navigate('EditChildScreen', { childId }),
              last: true,
            })}
          </View>
        </ScrollView>
      </View>
    </BackgroundWrapper>
  );
};

export default Child;
