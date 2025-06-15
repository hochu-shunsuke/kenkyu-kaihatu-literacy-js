"use client";

import { useState, useCallback } from "react";

const BOARD_SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

// 初期盤面
const createInitialBoard = () => {
  const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
  return board;
};

// 方向ベクトル（8方向）
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],           [0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1]
];

export default function OthelloGame() {
  const [board, setBoard] = useState(createInitialBoard);
  const [currentPlayer, setCurrentPlayer] = useState(BLACK);
  const [gameOver, setGameOver] = useState(false);

  // 指定した方向に石をひっくり返せるかチェック
  const canFlipInDirection = useCallback((board, row, col, player, direction) => {
    const [dr, dc] = direction;
    let r = row + dr;
    let c = col + dc;
    let hasOpponent = false;

    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
      if (board[r][c] === EMPTY) return false;
      if (board[r][c] === player) return hasOpponent;
      hasOpponent = true;
      r += dr;
      c += dc;
    }
    return false;
  }, []);

  // 有効な手かどうかチェック
  const isValidMove = useCallback((board, row, col, player) => {
    if (board[row][col] !== EMPTY) return false;
    return DIRECTIONS.some(direction => canFlipInDirection(board, row, col, player, direction));
  }, [canFlipInDirection]);

  // 石をひっくり返す
  const flipStones = useCallback((board, row, col, player) => {
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = player;

    DIRECTIONS.forEach(direction => {
      if (canFlipInDirection(board, row, col, player, direction)) {
        const [dr, dc] = direction;
        let r = row + dr;
        let c = col + dc;

        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && newBoard[r][c] !== player) {
          newBoard[r][c] = player;
          r += dr;
          c += dc;
        }
      }
    });

    return newBoard;
  }, [canFlipInDirection]);

  // 可能な手があるかチェック
  const hasValidMoves = useCallback((board, player) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(board, row, col, player)) return true;
      }
    }
    return false;
  }, [isValidMove]);

  // 石の数を数える
  const countStones = useCallback((board) => {
    let blackCount = 0;
    let whiteCount = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === BLACK) blackCount++;
        else if (board[row][col] === WHITE) whiteCount++;
      }
    }
    return { black: blackCount, white: whiteCount };
  }, []);

  // セルクリック処理
  const handleCellClick = useCallback((row, col) => {
    if (gameOver || !isValidMove(board, row, col, currentPlayer)) return;

    const newBoard = flipStones(board, row, col, currentPlayer);
    setBoard(newBoard);

    const nextPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    
    // 次のプレイヤーが手を打てるかチェック
    if (hasValidMoves(newBoard, nextPlayer)) {
      setCurrentPlayer(nextPlayer);
    } else if (hasValidMoves(newBoard, currentPlayer)) {
      // 次のプレイヤーがパス、現在のプレイヤーが続行
    } else {
      // 両プレイヤーが手を打てない場合、ゲーム終了
      setGameOver(true);
    }
  }, [board, currentPlayer, gameOver, isValidMove, flipStones, hasValidMoves]);

  // ゲームリセット
  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer(BLACK);
    setGameOver(false);
  };

  const stoneCounts = countStones(board);

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
          {/* ゲームボード */}
          <div className="flex-shrink-0">
            <div className="bg-emerald-800 p-2 rounded-lg shadow-lg">
              <div className="grid grid-cols-8 gap-1">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-12 h-12 md:w-12 md:h-12 bg-emerald-600 rounded transition-all duration-200 ease-in-out
                        flex items-center justify-center relative
                        ${isValidMove(board, rowIndex, colIndex, currentPlayer) && !gameOver 
                          ? 'hover:bg-emerald-500 cursor-pointer' 
                          : 'cursor-default'}
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      disabled={gameOver}
                      aria-label={`行${rowIndex + 1}, 列${colIndex + 1}のセル`}
                    >
                      {cell === BLACK && (
                        <div 
                          className="w-10 h-10 bg-black rounded-full shadow-md animate-[scale-in_0.2s_ease-out]"
                          role="img"
                          aria-label="黒石"
                        />
                      )}
                      {cell === WHITE && (
                        <div 
                          className="w-10 h-10 bg-white border border-gray-300 rounded-full shadow-md animate-[scale-in_0.2s_ease-out]"
                          role="img"
                          aria-label="白石"
                        />
                      )}
                      {cell === EMPTY && isValidMove(board, rowIndex, colIndex, currentPlayer) && !gameOver && (
                        <div 
                          className={`w-3 h-3 rounded-full opacity-40 ${
                            currentPlayer === BLACK ? 'bg-black' : 'bg-white'
                          }`}
                          role="img"
                          aria-label="有効な手"
                        />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ゲーム情報パネル */}
          <div className="w-full lg:w-80">
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-md border border-gray-600/40 p-4 space-y-6">
              {/* ゲーム状態セクション */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-3">ゲーム状態</h2>
                <div 
                  className={`p-3 rounded-md font-medium ${
                    gameOver 
                      ? 'bg-yellow-600/70 text-yellow-100'
                      : 'bg-gray-700/70 text-gray-100'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {gameOver ? (
                    <div className="space-y-1">
                      <div className="text-lg font-bold">ゲーム終了！</div>
                      <div>
                        {stoneCounts.black > stoneCounts.white ? "黒の勝利！" : 
                         stoneCounts.white > stoneCounts.black ? "白の勝利！" : "引き分け！"}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <div 
                        className={`w-4 h-4 rounded-full ${
                          currentPlayer === BLACK ? 'bg-black' : 'bg-white border border-gray-300'
                        }`}
                        role="img"
                        aria-label={currentPlayer === BLACK ? "黒石" : "白石"}
                      />
                      <span>{currentPlayer === BLACK ? "黒" : "白"}のターン</span>
                    </div>
                  )}
                </div>
              </div>

              {/* スコアセクション */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3 text-center">スコア</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 bg-black rounded-full"
                        role="img"
                        aria-label="黒石"
                      />
                      <span className="font-medium text-white">黒</span>
                    </div>
                    <span className="text-lg font-bold text-white">{stoneCounts.black}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 bg-white border border-gray-300 rounded-full"
                        role="img"
                        aria-label="白石"
                      />
                      <span className="font-medium text-white">白</span>
                    </div>
                    <span className="text-lg font-bold text-white">{stoneCounts.white}</span>
                  </div>
                </div>
              </div>

              {/* コントロールセクション */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3 text-center">ゲーム操作</h3>
                <button
                  onClick={resetGame}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
                  aria-label="新しいゲームを開始"
                >
                  新しいゲーム
                </button>
                <div className="text-sm text-gray-400 text-center mt-2">
                  <p>💡 有効な手の位置に小さな○が表示されます</p>
                </div>
              </div>

              {/* ルールセクション */}
              <div>
                <h3 className="text-base font-bold text-white mb-2 text-center">ルール</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• 相手の石を挟んでひっくり返す</p>
                  <p>• 有効な手がない場合はパス</p>
                  <p>• 盤面が埋まったらゲーム終了</p>
                  <p>• 石の数が多い方の勝利</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
