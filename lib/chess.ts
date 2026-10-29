import { Chess, Move } from "chess.js";

const pieceValues: Record<string, number> = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
const centerSquares = ["d4", "d5", "e4", "e5", "c4", "c5", "f4", "f5"];

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

function evaluatePosition(chess: Chess) {
  if (chess.isCheckmate()) return chess.turn() === "w" ? -100000 : 100000;
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) return 0;

  const material = evaluateMaterial(chess);
  const mobilityTurn = chess.turn();
  const mobility = chess.moves().length * (mobilityTurn === "w" ? 2 : -2);
  const board = chess.board();
  let development = 0;
  let center = 0;

  for (const row of board) {
    for (const piece of row) {
      if (!piece) continue;
      const sign = piece.color === "w" ? 1 : -1;
      if ((piece.type === "n" || piece.type === "b") && !["b1", "g1", "b8", "g8", "c1", "f1", "c8", "f8"].includes(piece.square)) {
        development += sign * 12;
      }
      if (centerSquares.includes(piece.square)) center += sign * 10;
    }
  }

  return material + mobility + development + center;
}

function moveBonus(move: Move, clone: Chess) {
  const capture = move.captured ? (pieceValues[move.captured] ?? 0) - (pieceValues[move.piece] ?? 0) * 0.12 : 0;
  const check = clone.isCheck() ? 45 : 0;
  const mate = clone.isCheckmate() ? 100000 : 0;
  const center = centerSquares.includes(move.to) ? 18 : 0;
  const promotion = move.promotion ? 700 : 0;
  return capture + check + mate + center + promotion;
}

function orderedMoves(chess: Chess, limit = 24) {
  return (chess.moves({ verbose: true }) as Move[])
    .map((move) => {
      const clone = new Chess(chess.fen());
      clone.move(move.san);
      return { move, score: moveBonus(move, clone) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ move }) => move);
}

function minimax(chess: Chess, depth: number, alpha: number, beta: number): number {
  if (depth === 0 || chess.isGameOver()) return evaluatePosition(chess);

  const maximizingWhite = chess.turn() === "w";
  const moves = orderedMoves(chess, depth >= 2 ? 6 : 4);

  if (maximizingWhite) {
    let best = -Infinity;
    for (const move of moves) {
      const clone = new Chess(chess.fen());
      clone.move(move.san);
      best = Math.max(best, minimax(clone, depth - 1, alpha, beta));
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = Infinity;
  for (const move of moves) {
    const clone = new Chess(chess.fen());
    clone.move(move.san);
    best = Math.min(best, minimax(clone, depth - 1, alpha, beta));
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

export function chooseComputerMove(fen: string, difficulty: "easy" | "medium" | "hard") {
  const chess = new Chess(fen);
  const moves = difficulty === "easy" ? (chess.moves({ verbose: true }) as Move[]) : orderedMoves(chess, difficulty === "hard" ? 8 : 6);
  if (!moves.length) return null;
  if (difficulty === "easy") return moves[Math.floor(Math.random() * moves.length)];

  const scored = moves.map((move) => {
    const clone = new Chess(fen);
    clone.move(move.san);
    const perspective = chess.turn() === "w" ? 1 : -1;
    const searchScore = difficulty === "hard" ? minimax(clone, 2, -Infinity, Infinity) * perspective : evaluatePosition(clone) * perspective;
    const noise = difficulty === "medium" ? Math.random() * 90 : 0;
    return { move, score: searchScore + moveBonus(move, clone) + noise };
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
    engine: false,
    summary: "Analyse simplifiée sans moteur (heuristique sur les coups de dame et les échecs). Pour une vraie analyse, ouvrez la page Analyse.",
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
