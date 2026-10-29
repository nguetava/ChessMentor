import { NextResponse, type NextRequest } from "next/server";

// Protection CSRF : les requêtes mutantes vers /api doivent venir de la même origine.
export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Origine refusée." }, { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"]
};
