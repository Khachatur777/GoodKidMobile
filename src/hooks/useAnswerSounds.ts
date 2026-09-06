import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import Sound from 'react-native-sound';

// Звуки лежат в бандле, а не на сервере: реакция должна успевать за пальцем
// ребёнка, а сеть на это времени не оставляет. iOS ищет файл по имени с
// расширением, Android — по имени ресурса из res/raw, без него.
const FILES = {
  correct: Platform.OS === 'android' ? 'answer_correct' : 'answer_correct.m4a',
  wrong: Platform.OS === 'android' ? 'answer_wrong' : 'answer_wrong.m4a',
};

// Неверный ответ звучит тише верного. Ошибка для четырёхлетки — повод бросить,
// поэтому она отмечается, но не подчёркивается.
const VOLUME = { correct: 1, wrong: 0.75 };

type Kind = keyof typeof FILES;

// Оба звука загружаются один раз на всё приложение и не освобождаются. За одну
// сессию их проигрывают десятки раз, и загрузка на каждое нажатие означала бы
// звук, приходящий уже к следующему примеру. Вместе они весят 11 КБ.
const loaded: Partial<Record<Kind, Sound>> = {};

const load = (kind: Kind) => {
  if (loaded[kind]) return;

  const sound = new Sound(FILES[kind], Sound.MAIN_BUNDLE, error => {
    if (error) {
      // Звук — украшение: не загрузился, значит занятие идёт молча.
      console.log(`Sound ${kind} load error:`, error);
      return;
    }

    sound.setVolume(VOLUME[kind]);
    loaded[kind] = sound;
  });
};

const play = (kind: Kind) => {
  const sound = loaded[kind];
  if (!sound) return;

  // Ребёнок отвечает быстрее, чем звук доигрывает. Останавливаем и начинаем
  // сначала, иначе второй ответ подряд остаётся без звука.
  sound.stop(() => sound.play());
};

export function useAnswerSounds() {
  useEffect(() => {
    load('correct');
    load('wrong');
  }, []);

  return {
    playCorrect: useCallback(() => play('correct'), []),
    playWrong: useCallback(() => play('wrong'), []),
  };
}
