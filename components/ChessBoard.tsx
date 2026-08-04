"use client";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useMemo, useState } from "react";

export function ChessBoard({
  fen,
  onMove,
  orientation = "white",
  arrows = []
}: {
  fen: string;
  onMove?: (from: string, to: string, san: string, fen: string) => void;
  orientation?: "white" | "black";
  arrows?: [string, string, string?][];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const legalSquares = useMemo(() => {
    if (!selected) return {};
    const chess = new Chess(fen);
    return Object.fromEntries(chess.moves({ square: selected as never, verbose: true }).map((move) => [move.to, { background: "rgba(215,109,87,.35)", borderRadius: "50%" }]));
  }, [fen, selected]);

  function move(from: string, to: string) {
    const chess = new Chess(fen);
    const result = chess.move({ from, to, promotion: "q" });
    if (!result) return false;
    onMove?.(from, to, result.san, chess.fen());
    setSelected(null);
    return true;
  }

  return (
    <Chessboard
      position={fen}
      boardOrientation={orientation}
      arePiecesDraggable
      customArrows={arrows as never}
      customSquareStyles={legalSquares}
      onPieceDrop={(from, to) => move(from, to)}
      onSquareClick={(square) => {
        if (selected) {
          if (!move(selected, square)) setSelected(square);
        } else {
          setSelected(square);
        }
      }}
    />
  );
}
