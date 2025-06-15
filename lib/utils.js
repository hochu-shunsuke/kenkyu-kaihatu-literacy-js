import { paths } from './config.js';

/**
 * パブリックアセットのURLを生成
 * @param {string} path - アセットのパス
 * @returns {string} 完全なURL
 */
export function getAssetUrl(path) {
  // パスの先頭の / を削除（もしあれば）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${paths.public}/${cleanPath}`;
}

/**
 * ページのURLを生成
 * @param {string} path - ページのパス
 * @returns {string} 完全なURL
 */
export function getPageUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${paths.base}${cleanPath}`;
}

/**
 * クラス名を結合
 * @param {...string} classes - クラス名
 * @returns {string} 結合されたクラス名
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
