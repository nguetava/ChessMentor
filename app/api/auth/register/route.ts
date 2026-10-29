import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { limited, parseBody } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const blocked = limited(request, "register", 5, 60 * 60 * 1000);
  if (blocked) return blocked;
  try {
    const body = await parseBody(request, registerSchema, "Formulaire invalide (mot de passe : 10 caractères minimum, lettres et chiffres).");
    if (body.error) return body.error;
    const { displayName, email, password, locale, chessLevel } = body.data;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Inscription impossible avec ces informations." }, { status: 409 });
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        profile: { create: { displayName, locale, chessLevel } },
        statistics: { create: { xp: 0 } }
      }
    });
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json({ error: "Inscription indisponible. Vérifiez la base de données et réessayez." }, { status: 503 });
  }
}
