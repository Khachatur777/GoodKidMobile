export const homeRoutes = (version: string = 'v1') => {
  return {
    getAllHomeVideos: `/${version}/videos`,
    getSearchTitleVideos: `/${version}/videos/search-titles`,
    getVideosCount: `/${version}/videos/count`,
  };
};
