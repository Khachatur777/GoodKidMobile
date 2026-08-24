// Some YouTube videos have no maxresdefault.jpg — it exists only when the author
// uploaded a high-resolution cover. hqdefault is always there, so that is the
// fallback when the main address does not load.
export const thumbnailFallback = (url?: string | null): string | undefined => {
  if (!url) return undefined;

  const fallback = url.replace('/maxresdefault.jpg', '/hqdefault.jpg');

  return fallback === url ? undefined : fallback;
};
