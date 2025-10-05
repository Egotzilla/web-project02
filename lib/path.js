// Utility helpers for handling basePath-aware URLs on the client

// Use the correct basePath from Next.js config
const BASE_PATH = '/app/webproject02';

export function withBasePath(path) {
  if (!path) return BASE_PATH;
  // Avoid double-prefixing and allow absolute URLs to pass through
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (BASE_PATH && path.startsWith(BASE_PATH)) return path;
  if (path.startsWith('/')) return `${BASE_PATH}${path}`;
  return `${BASE_PATH}/${path}`;
}

export function api(path) {
  // Ensure API calls resolve under basePath when executed in the browser
  // Make sure we're using the correct basePath from Next.js config
  const apiPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? '' : '/'}${path}`;
  return withBasePath(apiPath);
}


