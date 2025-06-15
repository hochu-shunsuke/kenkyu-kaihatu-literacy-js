import Link from "next/link";
import { getImagePath } from "../app/config";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/[.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ・タイトル */}
          <Link 
            href="/" 
            className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
          >
            研究開発リテラシー
          </Link>

          {/* ナビゲーションメニュー */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-gray-300 transition-colors"
            >
              ホーム
            </Link>
            <Link 
              href="/othello" 
              className="text-white hover:text-gray-300 transition-colors"
            >
              オセロ
            </Link>
            <Link 
              href="/simple" 
              className="text-white hover:text-gray-300 transition-colors"
            >
              機能案
            </Link>
          </div>

          {/* ユーザー情報 */}
          <div className="flex items-center space-x-3">
            <span className="text-white text-sm">ゲスト</span>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black text-sm font-medium">G</span>
            </div>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div className="md:hidden px-4 pb-3 border-t border-white/[.08]">
        <div className="flex flex-col space-y-2">
          <Link 
            href="/" 
            className="text-white hover:text-gray-300 transition-colors py-2"
          >
            ホーム
          </Link>
          <Link 
            href="/othello" 
            className="text-white hover:text-gray-300 transition-colors py-2"
          >
            オセロ
          </Link>
        </div>
      </div>
    </nav>
  );
}
