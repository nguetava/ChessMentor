import { z } from "zod";

export const registerSchema = z.object({
  displayName: z.string().min(2).max(40),
  email: z.string().email(),
  password: z.string().min(8),
  locale: z.enum(["fr", "de", "en"]).default("fr"),
  chessLevel: z.enum(["NO_RULES", "BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("NO_RULES")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const gameSaveSchema = z.object({
  pgn: z.string().min(1),
  result: z.enum(["WHITE_WIN", "BLACK_WIN", "DRAW", "ONGOING"]),
  color: z.string(),
  difficulty: z.string(),
  trainingMode: z.boolean(),
  moves: z.array(z.object({ san: z.string(), fen: z.string(), ply: z.number() })).default([])
});
