import { NavigationProp, RouteProp } from '@react-navigation/native';
import {
  BackgroundWrapper,
  Button,
  KidAvatar,
  SegmentedControl,
  Typography,
} from 'molecules';
import { BaseSkeleton } from 'organisms';
import { FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { IChildActivityItem } from 'models';
import { getChildrenState, useGetChildActivityQuery } from 'rtk';
import { ThemeContext } from 'theme';
import { childActivityStyles } from './child-activity-styles';

export interface ChildActivityProps {
  navigation: NavigationProp<any>;
  route: RouteProp<{ params: { childId: string } }, 'params'>;
}

// Minutes are labelled through the dictionary: 'min' used to be hardcoded in
// English and stayed that way in Russian and Armenian
const minutes = (seconds?: number | null) => Math.max(1, Math.round((seconds || 0) / 60));

const timeOfDay = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Days are counted in the device's local time: the server sends timestamps, and
// grouping into Today / Yesterday only makes sense in the parent's time zone.
const daysAgo = (iso: string) => {
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const diff = startOfDay(new Date()) - startOfDay(new Date(iso));

  return Math.round(diff / (24 * 60 * 60 * 1000));
};

const ChildActivity: FC<ChildActivityProps> = ({ route }) => {
  const { t } = useTranslation();
  const { color } = useContext(ThemeContext);
  const styles = useMemo(() => childActivityStyles(color), [color]);
  const children = useSelector(getChildrenState);
  const child = children.find(item => item.id === route.params?.childId);

  const [type, setType] = useState<'video' | 'learn'>('video');

  const { data, isFetching, isError, refetch } = useGetChildActivityQuery(
    { id: route.params?.childId, type },
    { refetchOnMountOrArgChange: true },
  );

  const items = data?.data?.items || [];
  // The server sets how deep history goes — the header shows what arrived
  const days = data?.data?.days ?? 3;

  const groups = useMemo(() => {
    const byDay = new Map<number, IChildActivityItem[]>();

    items.forEach(item => {
      const key = daysAgo(item.lastSeenAt);
      if (!byDay.has(key)) byDay.set(key, []);
      byDay.get(key)!.push(item);
    });

    return [...byDay.entries()].sort((a, b) => a[0] - b[0]);
  }, [items]);

  const dayTitle = (value: number) => {
    if (value === 0) return t('child_activity_today');
    if (value === 1) return t('child_activity_yesterday');
    return t('child_activity_days_ago', { count: value });
  };

  return (
    <BackgroundWrapper>
      <View style={styles.header}>
        <KidAvatar avatarId={child?.avatar} size={44} />

        <View style={styles.headerTexts}>
          <Typography type="bodyLBold">{child?.name}</Typography>

          <Typography type="caption" textColor="text_secondary">
            {t('child_activity_range', { days })}
          </Typography>
        </View>
      </View>

      <View style={styles.tabs}>
        <SegmentedControl
          items={[
            { value: 'video', title: t('child_activity_videos') },
            { value: 'learn', title: t('child_activity_learn') },
          ]}
          value={type}
          onChange={value => setType(value as 'video' | 'learn')}
        />
      </View>

      {isError ? (
        <View style={styles.centered}>
          <Typography type="title3" alignment="center">
            {t('child_activity_error_title')}
          </Typography>

          <Button variant="outline" title={t('children_try_again')} onPress={refetch} />
        </View>
      ) : isFetching && items.length === 0 ? (
        <View style={styles.scrollContainer}>
          <BaseSkeleton height={82} radius={22} count={3} betweenSpace={10} />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Typography type="title3" alignment="center">
            {t('child_activity_empty_title', { days })}
          </Typography>

          <Typography type="bodyM" textColor="text_secondary" alignment="center">
            {t('child_activity_empty_description', { name: child?.name })}
          </Typography>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {groups.map(([day, dayItems]) => (
            <View key={day}>
              <View style={styles.dayLabel}>
                <Typography type="captionBold" textColor="text_secondary">
                  {dayTitle(day).toUpperCase()}
                </Typography>
              </View>

              {dayItems.map(item =>
                item.type === 'video' ? (
                  <View key={item.id} style={styles.videoRow}>
                    {item.thumbnail ? (
                      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                    ) : (
                      <View style={styles.thumbnail} />
                    )}

                    <View style={styles.rowTexts}>
                      <Typography type="bodySBold" numberOfLines={2}>
                        {item.title || ''}
                      </Typography>

                      <View style={styles.rowMeta}>
                        <Typography type="caption" textColor="text_tertiary">
                          {t('child_activity_watched', {
                            watched: t('duration_minutes', {value: minutes(item.watchedSeconds)}),
                            total: t('duration_minutes', {value: minutes(item.durationSeconds)}),
                          })}
                        </Typography>

                        <Typography type="caption" textColor="text_tertiary">
                          {timeOfDay(item.lastSeenAt)}
                        </Typography>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View key={item.id} style={styles.learnRow}>
                    <View style={styles.learnTile} />

                    <View style={styles.rowTexts}>
                      <Typography type="bodySBold" numberOfLines={2}>
                        {item.title || ''}
                      </Typography>
                    </View>

                    <Typography type="caption" textColor="text_tertiary">
                      {timeOfDay(item.lastSeenAt)}
                    </Typography>
                  </View>
                ),
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </BackgroundWrapper>
  );
};

export default ChildActivity;
