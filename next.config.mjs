/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/kenkyu-kaihatu-literacy-js' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kenkyu-kaihatu-literacy-js/' : '',
};

export default nextConfig;
