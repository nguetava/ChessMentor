import { NextResponse } from "next/server";
import { analyzePgn } from "@/lib/chess";
import { limited, parseBody } from "@/lib/http";
import { analysisSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const blocked = limited(request, "analysis", 30, 60 * 1000);
  if (blocked) return blocked;
  const body = await parseBody(request, analysisSchema, "PGN invalide ou trop long.");
  if (body.error) return body.error;
  return NextResponse.json(analyzePgn(body.data.pgn));
}
