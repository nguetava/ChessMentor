import { z } from "zod";

export const registerSchema = z.object({
  displayName: z.string().trim().min(2).max(40),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z
    .string()
    .min(10)
    .max(72)
    .regex(/[a-zA-Z]/)
    .regex(/[0-9]/),
  locale: z.literal("fr").default("fr"),
  chessLevel: z.enum(["NO_RULES", "BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("NO_RULES")
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(72)
});

export const analysisSchema = z.object({
  pgn: z.string().max(20000).default("")
});

export const progressSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("lesson"), slug: z.string().min(1).max(120) }),
  z.object({ type: z.literal("exercise"), slug: z.string().min(1).max(120), correct: z.boolean() })
]);

export const gameSaveSchema = z.object({
  pgn: z.string().min(1).max(20000),
  result: z.enum(["WHITE_WIN", "BLACK_WIN", "DRAW", "ONGOING"]).optional(),
  color: z.enum(["white", "black"]).catch("white"),
  difficulty: z.string().max(30),
  trainingMode: z.boolean(),
  moves: z.array(z.object({ san: z.string().max(12), fen: z.string().max(100), ply: z.number() })).max(600).optional()
});
