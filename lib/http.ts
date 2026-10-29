import { NextResponse } from "next/server";
import type { ZodTypeAny, z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Lit et valide un corps JSON. Renvoie soit les données, soit une réponse d'erreur 400. */
export async function parseBody<S extends ZodTypeAny>(request: Request, schema: S, message = "Requête invalide.") {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { error: NextResponse.json({ error: message }, { status: 400 }) } as const;
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: NextResponse.json({ error: message }, { status: 400 }) } as const;
  return { data: parsed.data as z.infer<S> } as const;
}

/** Applique une limite par IP et par route. Renvoie une réponse 429 si dépassée. */
export function limited(request: Request, name: string, limit: number, windowMs: number) {
  const res = rateLimit(`${name}:${clientIp(request)}`, limit, windowMs);
  if (res.ok) return null;
  return NextResponse.json(
    { error: "Trop de requêtes. Réessayez plus tard." },
    { status: 429, headers: { "Retry-After": String(res.retryAfter) } }
  );
}
