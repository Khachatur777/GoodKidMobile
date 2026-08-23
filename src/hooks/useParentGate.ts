import { useCallback, useRef, useState } from 'react';

// Взрослые действия — выход из приложения наружу, покупки, чужие данные —
// закрываются арифметическим вопросом. Хук держит отложенное действие и
// отдаёт готовые props для ParentGateModal, чтобы каждый экран не переписывал
// одно и то же.
export const useParentGate = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const runBehindGate = useCallback((action: () => void) => {
    pendingAction.current = action;
    setIsVisible(true);
  }, []);

  const onSuccess = useCallback(() => {
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }, []);

  return {
    runBehindGate,
    gateProps: { isVisible, setIsVisible, onSuccess },
  };
};

export default useParentGate;
