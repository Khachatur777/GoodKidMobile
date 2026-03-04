export const learnRoutes = (version: string = 'v1') => {
  return {
    allLearnCategory: `/${version}/knowledge/category`,
    allLearnCategoryItems: `/${version}/knowledge/items`,
    viewLearnItems: `/${version}/knowledge/view`,
    viewLearnItemsReset: `/${version}/knowledge/view/reset`,
  };
};
