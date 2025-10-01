/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serve the app under /app/webproject02
  basePath: '/app/webproject02',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/app/webproject02',
  },
};

export default nextConfig;
