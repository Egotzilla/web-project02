// Utility helpers for handling basePath-aware URLs on the client

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

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
  return withBasePath(path.startsWith('/api') ? path : `/api${path.startsWith('/') ? '' : '/'}${path}`);
}


