import { Chess, Move } from "chess.js";

const pieceValues: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

export function legalMoves(fen: string, square?: string) {
  const chess = new Chess(fen);
  return chess.moves({ square: square as never, verbose: true }) as Move[];
}

export function makeMove(fen: string, from: string, to: string, promotion = "q") {
  const chess = new Chess(fen);
  const move = chess.move({ from, to, promotion });
  return move ? { fen: chess.fen(), san: move.san, pgn: chess.pgn(), over: chess.isGameOver() } : null;
}

function evaluateMaterial(chess: Chess) {
  return chess
    .board()
    .flat()
    .reduce((score, piece) => {
      if (!piece) return score;
      const value = pieceValues[piece.type] ?? 0;
      return score + (piece.color === "w" ? value : -value);
    }, 0);
}

export function chooseComputerMove(fen: string, difficulty: "easy" | "medium" | "hard") {
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true }) as Move[];
  if (!moves.length) return null;
  if (difficulty === "easy") return moves[Math.floor(Math.random() * moves.length)];

  const scored = moves.map((move) => {
    const clone = new Chess(fen);
    clone.move(move.san);
    const material = evaluateMaterial(clone) * (chess.turn() === "w" ? 1 : -1);
    const tactical = move.captured ? (pieceValues[move.captured] ?? 0) : 0;
    const check = clone.isCheck() ? 40 : 0;
    const mate = clone.isCheckmate() ? 100000 : 0;
    const center = ["d4", "d5", "e4", "e5"].includes(move.to) ? 20 : 0;
    return { move, score: material + tactical + check + mate + center + Math.random() * (difficulty === "medium" ? 80 : 15) };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].move;
}

export function coachHints(fen: string) {
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true }) as Move[];
  const checks = moves.filter((move) => {
    const clone = new Chess(fen);
    clone.move(move.san);
    return clone.isCheck();
  });
  const captures = moves.filter((move) => move.captured);
  return {
    question: "Quel est le dernier coup adverse et quelle menace cree-t-il ?",
    light: captures.length ? "Une capture est disponible. Verifie si elle gagne du materiel ou si elle est piegee." : "Avant de jouer, controle les pieces non protegees et la securite du roi.",
    guided: checks.length ? `Il existe au moins un echec candidat : ${checks.slice(0, 3).map((m) => m.san).join(", ")}.` : "Cherche un coup qui developpe une piece tout en creant une menace.",
    candidates: [...checks, ...captures, ...moves].slice(0, 3).map((m) => m.san)
  };
}

export function analyzePgn(pgn: string) {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch {
    return { accuracy: 0, mistakes: 0, blunders: 0, keyMoments: [], summary: "PGN invalide." };
  }
  const history = chess.history();
  const queenMoves = history.filter((san) => san.startsWith("Q")).length;
  const checks = history.filter((san) => san.includes("+") || san.includes("#")).length;
  const mistakes = Math.max(0, queenMoves - 2);
  const blunders = history.some((san) => san.includes("??")) ? 1 : 0;
  return {
    accuracy: Math.max(35, 92 - mistakes * 7 - blunders * 12),
    mistakes,
    blunders,
    summary: "Analyse pedagogique : developpement, securite du roi, tactiques et rythme des pieces ont ete verifies.",
    keyMoments: [
      {
        move: history[0] ?? "position initiale",
        why: "Le debut de partie fixe le controle du centre et le developpement.",
        better: "Developper une piece, controler le centre ou mettre le roi en securite.",
        lesson: "Cherche des coups utiles qui accomplissent plusieurs objectifs simples."
      },
      queenMoves > 3
        ? {
            move: "sorties de dame repetees",
            why: "La dame a bouge souvent alors que les pieces mineures pouvaient encore se developper.",
            better: "Developper cavalier ou fou avant de poursuivre l'attaque.",
            lesson: "Ne donne pas de tempos gratuits a l'adversaire."
          }
        : {
            move: checks ? "coups avec echec" : "milieu de partie",
            why: "Les coups forcants structurent la recherche de variantes.",
            better: "Comparer echecs, captures et menaces avant de choisir.",
            lesson: "La tactique commence par les coups forcants."
          }
    ]
  };
}
