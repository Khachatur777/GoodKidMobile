import { useCallback, useEffect, useRef, useState } from 'react';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export function useAudioPlayer() {
  const soundRef = useRef<Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    const s = soundRef.current;
    if (!s) return;

    s.stop(() => {
      s.release();
      soundRef.current = null;
      setPlaying(false);
    });
  }, []);

  const play = useCallback(
    (url: string) => {
      if (!url) return;

      stop();
      setPlaying(true);

      const s = new Sound(url, undefined, error => {
        if (error) {
          console.log('Sound load error:', error);
          setPlaying(false);
          return;
        }

        soundRef.current = s;

        s.play(success => {
          s.release();
          soundRef.current = null;
          setPlaying(false);

          if (!success) console.log('Sound play failed');
        });
      });
    },
    [stop],
  );

  useEffect(() => () => stop(), [stop]);

  return { play, stop, playing };
}
