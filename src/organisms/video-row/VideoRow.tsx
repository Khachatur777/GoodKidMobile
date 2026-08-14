import {FC, useContext, useMemo} from 'react';
import {Image, Pressable, View} from 'react-native';
import {Typography} from 'molecules';
import {ThemeContext} from 'theme';
import {videoRowStyles} from './video-row-styles.ts';

export interface VideoRowProps {
  title: string;
  thumbnail?: string;
  meta?: string;
  size?: 'small' | 'medium';
  onPress?: () => void;
}

const VideoRow: FC<VideoRowProps> = ({
  title,
  thumbnail,
  meta,
  size = 'small',
  onPress,
}) => {
  const {color} = useContext(ThemeContext);
  const styles = useMemo(() => videoRowStyles({color, size}), [color, size]);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{uri: thumbnail}} style={styles.thumbnail} fadeDuration={0} />

      <View style={styles.textContainer}>
        <Typography type="bodyBold" numberOfLines={size === 'small' ? 1 : 2}>
          {title}
        </Typography>

        {meta ? (
          <Typography type="bodyS" textColor="text_secondary" numberOfLines={1}>
            {meta}
          </Typography>
        ) : null}
      </View>
    </Pressable>
  );
};

export default VideoRow;
