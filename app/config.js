// GitHub Pages用のbasePath設定
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'kenkyu-kaihatu-literacy-js';

export const basePath = isProd ? `/${repoName}` : '';

// 画像パス用のヘルパー関数
// Next.jsのImage componentは自動的にbasePathを適用しないため、手動で設定が必要
export const getImagePath = (path) => `${basePath}${path}`;

// 静的ファイル（favicon等）のパス用
export const getStaticPath = (path) => `${basePath}${path}`;
