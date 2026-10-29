import { NextResponse } from "next/server";
import { courses, exercises } from "@/data/content";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  return NextResponse.json({ courses, exercises });
}
