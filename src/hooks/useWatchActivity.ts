import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getIsChildState, useRecordVideoActivityMutation } from 'rtk';

const PROGRESS_INTERVAL_MS = 15000;

// История просмотров ведётся только по детям — родителю она нужна про них,
// а не про себя. Пишем старт, потом накопленные секунды раз в 15 секунд и
// последний раз при уходе с видео. Сервер берёт максимум, поэтому порядок
// доставки значения не имеет.
const useWatchActivity = (videoId?: string | null, playing?: boolean) => {
  const isChild = useSelector(getIsChildState);
  const [recordVideoActivity] = useRecordVideoActivityMutation();

  const watchedSeconds = useRef(0);
  const lastSentSeconds = useRef(0);

  const send = (seconds: number) => {
    if (!isChild || !videoId) return;

    recordVideoActivity({
      videoId,
      watchedSeconds: Math.round(seconds),
      // Тихо на фоне: ошибки трекинга не должны мешать смотреть
      showLoader: false,
      showModal: false,
    });
  };

  // Новое видео — счётчик с нуля и отметка о старте
  useEffect(() => {
    watchedSeconds.current = 0;
    lastSentSeconds.current = 0;

    if (isChild && videoId) {
      send(0);
    }

    return () => {
      if (watchedSeconds.current > lastSentSeconds.current) {
        send(watchedSeconds.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, isChild]);

  useEffect(() => {
    if (!isChild || !videoId || !playing) return;

    const interval = setInterval(() => {
      watchedSeconds.current += PROGRESS_INTERVAL_MS / 1000;
      lastSentSeconds.current = watchedSeconds.current;
      send(watchedSeconds.current);
    }, PROGRESS_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, playing, isChild]);
};

export default useWatchActivity;
