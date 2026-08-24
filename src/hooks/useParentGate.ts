import { useCallback, useRef, useState } from 'react';

// Adult actions — leaving the app, purchases, other people's data — are closed
// by an arithmetic question. The hook holds the pending action and returns
// ready-made props for ParentGateModal, so no screen has to rewrite the same
// thing.
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
