import EventEmitter from 'eventemitter3';
import i18n from 'i18next';
import { useCallback } from 'react';

export const eventEmitter = new EventEmitter();

export const getFontFamily = (
  fontFamily: 'Montserrat' | 'NotoSans',
  fontWeight: 'Regular' | 'SemiBold' | 'Medium',
) => {
  if (i18n.language === 'hy') {
    return {
      fontFamily: `${fontFamily}${
        fontFamily === 'Montserrat' ? 'arm' : 'Armenian'
      }-${fontWeight}`,
    };
  } else {
    return {
      fontFamily: `${fontFamily}-${fontWeight}`,
    };
  }
};

export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // pad with leading zeros
  const pad = (n: any) => String(n).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`; // hh:mm:ss
  }
  return `${pad(minutes)}:${pad(seconds)}`; // mm:ss
};

export function formatNumberWithSpaces(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}


export const maskedValue = (value: string, length?: number) => {
  const dateFormat = value.toString().includes('/');
  const val = value
    .toString()
    .split(' ')
    .map(item => {
      return !dateFormat
        ? item
          .split('')
          .fill('•', 0, length || item.length)
          .join('')
          .slice(0, length || item.length)
        : item
          .split('')
          .fill('•', 0, length || item.length)
          .fill('/', 2, 3)
          .join('')
          .slice(0, length || item.length);
    });
  return val.join(' ');
};

export const formatCount = (num: number) => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2).replace(/\.0+$/, '') + 'B';
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.0+$/, '') + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.0+$/, '') + 'K';
  }
  return num?.toString?.();
};

export const timeAgo = (dateString: string) => {
  const now = new Date();
  const past = new Date(dateString);
  // @ts-ignore
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return count === 1 ? `1 ${unit} ago` : `${count} ${unit}s ago`;
    }
  }
  return i18n.t('just_now');
};


export const validateThen =
  async (onValid: () => void | Promise<void>, formik: any) => {
    if (!formik) return;

    const errors = await formik.validateForm();
    const hasErrors = !!Object.keys(errors || {}).length;

    if (hasErrors) {
      formik.setTouched(
        Object.fromEntries(Object.keys(errors).map(k => [k as any, true])),
        true,
      );
      return;
    }

    await onValid();
  };

