export const videoLockRoutes = (version: string = 'v1') => {
  return {
    // Ребёнок: своё состояние и оплата. Читается из токена, а не из тела.
    myLock: `/${version}/videos/lock`,
    unlock: `/${version}/videos/unlock`,
    // Родитель: настройка для конкретного ребёнка, рядом с его фильтром.
    childLock: (childId: string) => `/${version}/children/${childId}/video-lock`,
  };
};
