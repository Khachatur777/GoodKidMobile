import { useCallback, useEffect, useRef, useState } from 'react';
import Sound from 'react-native-sound';

// 'Playback' ignores the silent switch. A card whose question is spoken has to
// speak with the ringer off, or a child in a quiet room gets a screen that
// simply does nothing.
Sound.setCategory('Playback');

export function useAudioPlayer() {
  const soundRef = useRef<Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  // Loading is asynchronous, so a child swiping through cards can start a
  // second sound before the first has finished loading. Each play claims a
  // number, and a callback that is no longer the current one is dropped —
  // otherwise the older sound releases the newer one and the card falls silent.
  const generation = useRef(0);

  const stop = useCallback(() => {
    generation.current += 1;

    const sound = soundRef.current;
    soundRef.current = null;
    setPlaying(false);

    if (sound) {
      sound.stop(() => sound.release());
    }
  }, []);

  const play = useCallback((url: string) => {
    if (!url) return;

    stop();
    const mine = generation.current;
    setPlaying(true);

    const sound = new Sound(url, undefined, error => {
      if (mine !== generation.current) {
        // Another card took over while this one was loading.
        sound.release();
        return;
      }

      if (error) {
        console.log('Sound load error:', error);
        setPlaying(false);
        return;
      }

      soundRef.current = sound;

      sound.play(success => {
        sound.release();

        if (mine !== generation.current) return;

        soundRef.current = null;
        setPlaying(false);

        if (!success) console.log('Sound play failed');
      });
    });
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return { play, stop, playing };
}
