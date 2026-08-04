import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
    const { displayName, email, password, locale, chessLevel } = parsed.data;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Cet email existe deja." }, { status: 409 });
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
  } catch {
    return NextResponse.json({ error: "Inscription indisponible. Verifiez la base de donnees et reessayez." }, { status: 503 });
  }
}
