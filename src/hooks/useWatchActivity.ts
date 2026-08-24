import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getIsChildState, useRecordVideoActivityMutation } from 'rtk';

const PROGRESS_INTERVAL_MS = 15000;

// Watch history is kept for children only — a parent wants it about them, not
// about themselves. We send a start marker, then the accumulated seconds every
// 15 seconds, and once more when leaving the video. The server keeps the
// maximum, so delivery order does not matter.
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
      // Quiet in the background: tracking errors must not interrupt watching
      showLoader: false,
      showModal: false,
    });
  };

  // A new video means the counter starts over, with a fresh start marker
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
