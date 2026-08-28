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
  };
};
