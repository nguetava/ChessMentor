"use client";

import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useEffect, useMemo, useState } from "react";

export function ChessBoard({
  fen,
  onMove,
  orientation = "white",
  arrows = [],
  disabled = false
}: {
  fen: string;
  onMove?: (from: string, to: string, san: string, fen: string) => void;
  orientation?: "white" | "black";
  arrows?: [string, string, string?][];
  disabled?: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [localFen, setLocalFen] = useState(fen);
  const displayFen = onMove ? fen : localFen;

  useEffect(() => {
    setLocalFen(fen);
    setSelected(null);
  }, [fen]);

  const legalSquares = useMemo(() => {
    if (!selected) return {};
    const chess = new Chess(displayFen);
    return {
      [selected]: { background: "rgba(181,139,50,.35)" },
      ...Object.fromEntries(chess.moves({ square: selected as never, verbose: true }).map((move) => [move.to, { background: "rgba(215,109,87,.35)", borderRadius: "50%" }]))
    };
  }, [displayFen, selected]);

  function move(from: string, to: string) {
    if (disabled) return false;
    const chess = new Chess(displayFen);
    const result = chess.move({ from, to, promotion: "q" });
    if (!result) return false;
    if (onMove) onMove(from, to, result.san, chess.fen());
    else setLocalFen(chess.fen());
    setSelected(null);
    return true;
  }

  return (
    <Chessboard
      position={displayFen}
      boardOrientation={orientation}
      arePiecesDraggable={!disabled}
      customArrows={arrows as never}
      customSquareStyles={legalSquares}
      onPieceDrop={(from, to) => move(from, to)}
      onSquareClick={(square) => {
        if (disabled) return;
        const chess = new Chess(displayFen);
        const piece = chess.get(square as never);
        const isOwnPiece = piece?.color === chess.turn();

        if (isOwnPiece) {
          setSelected(square);
          return;
        }

        if (selected) {
          if (!move(selected, square)) setSelected(null);
        }
      }}
    />
  );
}
