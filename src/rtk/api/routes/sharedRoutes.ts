export const sharedRoutes = (version: string = 'v1') => {
  return {
    getTranslations: `/${version}/translations`,
    privacy: `/${version}/legal/privacy`,
    terms: `/${version}/legal/terms`,
  };
};
