export const childrenRoutes = (version: string = 'v1') => {
  return {
    children: `/${version}/children`,
    child: (id: string) => `/${version}/children/${id}`,
    childPassword: (id: string) => `/${version}/children/${id}/password`,
    // Фильтр принадлежит ребёнку: у родителя своей фильтрации нет
    childFilter: (id: string) => `/${version}/children/${id}/filter`,
    childActivity: (id: string) => `/${version}/children/${id}/activity`,
    videoActivity: `/${version}/activity/video`,
  };
};
