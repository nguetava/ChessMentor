"use client";

import { useEffect, useState } from "react";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { ChessBoard } from "@/components/ChessBoard";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

type ReplayMove = { ply: number; san: string; fen: string };

export function GameReplay({ moves, orientation }: { moves: ReplayMove[]; orientation: "white" | "black" }) {
  const [index, setIndex] = useState(moves.length);
  const fen = index === 0 ? START_FEN : moves[index - 1].fen;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") setIndex((value) => Math.max(0, value - 1));
      if (event.key === "ArrowRight") setIndex((value) => Math.min(moves.length, value + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moves.length]);

  const controls = [
    { label: "Début", icon: ChevronFirst, action: () => setIndex(0), disabled: index === 0 },
    { label: "Coup précédent", icon: ChevronLeft, action: () => setIndex(index - 1), disabled: index === 0 },
    { label: "Coup suivant", icon: ChevronRight, action: () => setIndex(index + 1), disabled: index === moves.length },
    { label: "Fin", icon: ChevronLast, action: () => setIndex(moves.length), disabled: index === moves.length }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(300px,520px)_1fr]">
      <div className="grid gap-3">
        <ChessBoard fen={fen} orientation={orientation} disabled boardWidth={Math.min(520, 480)} />
        <div className="flex justify-center gap-2">
          {controls.map(({ label, icon: Icon, action, disabled }) => (
            <button key={label} onClick={action} disabled={disabled} aria-label={label} title={label} className="rounded border p-3 disabled:opacity-40 dark:border-white/10">
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
      <ol className="flex max-h-[520px] flex-wrap content-start gap-2 overflow-auto text-sm" aria-label="Coups de la partie">
        {moves.map((move) => (
          <li key={move.ply}>
            <button
              onClick={() => setIndex(move.ply)}
              aria-current={index === move.ply}
              className={`rounded border px-2 py-1 dark:border-white/10 ${index === move.ply ? "bg-ink text-white dark:bg-coral" : ""}`}
            >
              {move.ply % 2 === 1 ? `${Math.ceil(move.ply / 2)}. ` : ""}
              {move.san}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

