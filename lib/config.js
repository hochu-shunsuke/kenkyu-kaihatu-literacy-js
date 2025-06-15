// サイト設定
export const siteConfig = {
  name: "研究開発リテラシー",
  description: "研究開発リテラシープロジェクト",
  url: process.env.NODE_ENV === 'production' 
    ? "https://hochu-shunsuke.github.io/kenkyu-kaihatu-literacy-js" 
    : "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    github: "https://github.com/hochu-shunsuke/kenkyu-kaihatu-literacy-js",
  },
};

// 開発環境の設定
export const isDev = process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';

// パス設定
export const paths = {
  base: isProd ? '/kenkyu-kaihatu-literacy-js' : '',
  public: isProd ? '/kenkyu-kaihatu-literacy-js' : '',
};

// API設定（必要に応じて）
export const apiConfig = {
  baseUrl: isProd 
    ? "https://hochu-shunsuke.github.io/kenkyu-kaihatu-literacy-js/api"
    : "http://localhost:3000/api",
};

export default siteConfig;
