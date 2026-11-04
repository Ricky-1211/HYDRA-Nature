/**
 * Resolves any image URL (local uploads, external URLs, data URLs, blobs)
 * to a fully qualified, displayable image URL.
 */
export const getImageUrl = (url?: string): string => {
  if (!url) return '';

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5012/api';
  const backendOrigin = apiBase.replace(/\/api\/?$/, '');

  // Automatically repair any legacy or hardcoded 5000 port references for uploads to active port 5012
  if (url.includes('localhost:5000/uploads')) {
    return url.replace('http://localhost:5000', backendOrigin);
  }

  // Already valid absolute URL or browser memory URL
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${backendOrigin}${cleanPath}`;
};
