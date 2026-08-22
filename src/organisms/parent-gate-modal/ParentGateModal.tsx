import React, { Dispatch, FC, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { Button, Modal, Spacing, Typography } from 'molecules';
import { ThemeContext } from 'theme';
import { parentGateStyles } from './parent-gate-modal-styles';

interface ParentGateModalProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  onSuccess: () => void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

// Взрослый раздел закрыт примером на умножение: ребёнок его не решит, взрослому
// он ничего не стоит. Попытки не ограничиваем и не отсчитываем время —
// так требуют и здравый смысл, и правила детской категории.
const ParentGateModal: FC<ParentGateModalProps> = ({
  isVisible,
  setIsVisible,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { color, theme } = useContext(ThemeContext);
  const styles = useMemo(() => parentGateStyles(color, theme === 'dark'), [color, theme]);

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Новый пример при каждом открытии и после каждой ошибки
  const numbers = useMemo(() => {
    const first = Math.floor(Math.random() * 8) + 2;
    const second = Math.floor(Math.random() * 8) + 2;

    return { first, second, result: first * second };
  }, [isVisible, attempt]);

  useEffect(() => {
    if (isVisible) {
      setValue('');
      setError(false);
    }
  }, [isVisible]);

  const onKeyPress = useCallback((key: string) => {
    if (!key) return;

    setError(false);

    if (key === '⌫') {
      return setValue(prev => prev.slice(0, -1));
    }

    setValue(prev => (prev.length >= 4 ? prev : prev + key));
  }, []);

  const onSubmit = useCallback(() => {
    if (Number(value) === numbers.result) {
      setIsVisible(false);
      setValue('');
      setError(false);
      return onSuccess?.();
    }

    setError(true);
    setValue('');
    setAttempt(prev => prev + 1);
  }, [numbers.result, onSuccess, setIsVisible, value]);

  return (
    <Modal
      type="bottom-sheet"
      showGrabber
      isVisible={isVisible}
      setIsVisible={setIsVisible}
    >
      <View style={styles.content}>
        <View style={[styles.iconTile, error ? styles.iconTileError : null]}>
          {/* Заглушки вместо иконок: в наборе приложения нет ни машущей руки,
              ни лампочки — их нужно дорисовать вместе с остальными ассетами */}
          <Text style={styles.iconGlyph}>{error ? '💡' : '👋'}</Text>
        </View>

        <Spacing size={14} />

        <Typography type="title3">{t('parent_gate_title')}</Typography>

        <Spacing size={6} />

        <Typography type="bodyM" textColor="text_secondary" alignment="center">
          {error ? t('parent_gate_error_description') : t('parent_gate_description')}
        </Typography>

        <Spacing size={20} />

        <View style={[styles.questionCard, error ? styles.questionCardError : null]}>
          <Typography type="titleL">
            {t('parent_gate_question', { first: numbers.first, second: numbers.second })}
          </Typography>

          <View
            style={[
              styles.answerBox,
              value ? styles.answerBoxFocused : null,
              error ? styles.answerBoxError : null,
            ]}
          >
            <Typography type="title2" textColor={error ? 'text_negative' : 'text_primary'}>
              {value}
            </Typography>
          </View>

          {error ? (
            <Typography type="bodySBold" textColor="text_negative">
              {t('parent_gate_error')}
            </Typography>
          ) : null}
        </View>

        <Spacing size={20} />

        <View style={styles.keypad}>
          {KEYS.map((key, index) => (
            <Pressable
              key={`${key}-${index}`}
              style={[styles.key, key ? null : styles.keyEmpty]}
              disabled={!key}
              onPress={() => onKeyPress(key)}
            >
              <Typography type="title3">{key}</Typography>
            </Pressable>
          ))}
        </View>

        <Spacing size={20} />

        <View style={styles.footer}>
          <View style={styles.footerButton}>
            <Button
              variant="outline"
              title={t('parent_gate_cancel')}
              onPress={() => setIsVisible(false)}
            />
          </View>

          <View style={styles.footerButton}>
            <Button title={t('parent_gate_continue')} onPress={onSubmit} />
          </View>
        </View>

        <Spacing size={8} />
      </View>
    </Modal>
  );
};

export default ParentGateModal;
