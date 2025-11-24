export const filterRoutes = (version: string = 'v1') => {
  return {
    editFilter: `/${version}/filter/edit`,
    getFilter: `/${version}/filter`,
  };
};

