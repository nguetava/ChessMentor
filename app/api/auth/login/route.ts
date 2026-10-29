import { NextResponse } from "next/server";
import { DUMMY_HASH, createSession, verifyPassword } from "@/lib/auth";
import { limited, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const blocked = limited(request, "login", 10, 15 * 60 * 1000);
  if (blocked) return blocked;
  try {
    const body = await parseBody(request, loginSchema, "Identifiants invalides.");
    if (body.error) return body.error;
    const user = await prisma.user.findUnique({ where: { email: body.data.email } });
    // Toujours exécuter bcrypt pour un temps de réponse constant (anti-énumération par timing).
    const valid = await verifyPassword(body.data.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !valid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[login]", error);
    return NextResponse.json({ error: "Connexion indisponible. Vérifiez la base de données et réessayez." }, { status: 503 });
  }
}
