export const childrenRoutes = (version: string = 'v1') => {
  return {
    children: `/${version}/children`,
    child: (id: string) => `/${version}/children/${id}`,
    childPassword: (id: string) => `/${version}/children/${id}/password`,
    // The filter belongs to a child: a parent has no filtering of their own
    childFilter: (id: string) => `/${version}/children/${id}/filter`,
    childActivity: (id: string) => `/${version}/children/${id}/activity`,
    videoActivity: `/${version}/activity/video`,
  };
};
