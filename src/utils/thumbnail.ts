// У части роликов на YouTube нет maxresdefault.jpg — он появляется только если
// автор загрузил обложку в высоком разрешении. hqdefault есть всегда, поэтому
// на нём и подстраховываемся, когда основной адрес не открылся.
export const thumbnailFallback = (url?: string | null): string | undefined => {
  if (!url) return undefined;

  const fallback = url.replace('/maxresdefault.jpg', '/hqdefault.jpg');

  return fallback === url ? undefined : fallback;
};
