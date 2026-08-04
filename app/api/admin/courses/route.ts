import { NextResponse } from "next/server";
import { courses, exercises } from "@/data/content";

export async function GET() {
  return NextResponse.json({ courses, exercises });
}

export async function POST(request: Request) {
  const payload = await request.json();
  return NextResponse.json({ ok: true, draft: payload });
}
