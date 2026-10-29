import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const cookieName = "chessmentor_session";
const DEV_FALLBACK_SECRET = "dev-only-insecure-secret-do-not-use-in-prod";
let cachedSecret: Uint8Array | null = null;

/** Secret JWT : obligatoire (32+ caractères) en production, avertissement en développement. */
function getSecret() {
  if (cachedSecret) return cachedSecret;
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET manquant ou trop court (32 caractères minimum).");
    }
    console.warn("[auth] AUTH_SECRET absent ou trop court : secret de développement utilisé.");
  }
  cachedSecret = new TextEncoder().encode(value && value.length >= 32 ? value : DEV_FALLBACK_SECRET);
  return cachedSecret;
}

// Hash factice pour garder un temps de réponse constant quand l'email n'existe pas.
export const DUMMY_HASH = "$2a$12$0eg86HKh1BD5b5esH6UF1.ieW/McRpbr2Dk/dqykr5DjVcKwFsNZG";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
  cookies().set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSession() {
  cookies().delete(cookieName);
}

export async function getCurrentUser() {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    const userId = String(payload.userId || "");
    if (!userId) return null;
    return await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, statistics: true, badges: { include: { badge: true } } }
    });
  } catch {
    return null;
  }
}

/** Les administrateurs sont listés dans ADMIN_EMAILS (séparés par des virgules). */
export function isAdminEmail(email: string) {
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export async function requireUser() {
  return getCurrentUser();
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  return user && isAdminEmail(user.email) ? user : null;
}

