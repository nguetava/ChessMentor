import { NextResponse } from "next/server";
import { analyzePgn } from "@/lib/chess";

export async function POST(request: Request) {
  const { pgn } = await request.json();
  return NextResponse.json(analyzePgn(String(pgn || "")));
}
