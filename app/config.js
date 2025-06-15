// GitHub Pages用のbasePath設定
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'kenkyu-kaihatu-literacy-js';

export const basePath = isProd ? `/${repoName}` : '';

// 画像パス用のヘルパー関数
export const getImagePath = (path) => `${basePath}${path}`;
