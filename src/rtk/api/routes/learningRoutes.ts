export const learningRoutes = (version: string = 'v1') => {
  return {
    mathCategories: `/${version}/learning/math/categories`,
    mathSession: `/${version}/learning/math/session`,
    finishSession: (sessionId: string) =>
      `/${version}/learning/session/${sessionId}/finish`,
    progress: `/${version}/learning/progress`,
    unlock: `/${version}/learning/unlock`,
    cardCategories: `/${version}/learning/cards/categories`,
    cardSession: `/${version}/learning/cards/session`,
    completeCategory: `/${version}/learning/cards/complete`,
    report: (childId: string) => `/${version}/learning/report/${childId}`,
    childMath: (childId: string) => `/${version}/learning/children/${childId}/math`,
    childMathOperation: (childId: string, operation: string) =>
      `/${version}/learning/children/${childId}/math/${operation}`,
    childMathPreview: (childId: string, operation: string) =>
      `/${version}/learning/children/${childId}/math/${operation}/preview`,
  };
};
