import OthelloGame from "../../components/OthelloGame";

export const metadata = {
  title: "オセロ - 研究開発リテラシー",
  description: "オセロゲームをプレイしよう",
};

export default function OthelloPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-white font-[family-name:var(--font-geist-sans)]">
            オセロゲーム
          </h1>
          <p className="text-gray-400 font-[family-name:var(--font-geist-mono)]">
            クリックして石を配置し、相手の石を挟んでひっくり返そう
          </p>
        </div>
        
        <OthelloGame />
      </div>
    </div>
  );
}
