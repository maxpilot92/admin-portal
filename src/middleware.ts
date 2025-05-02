import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ Configure allowed origins
const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ]
    : ["http://54.66.132.165", "http://3.107.67.84"];

// ✅ CORS configuration
const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // ✅ Handle preflight requests
  if (req.method === "OPTIONS") {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
      Vary: "Origin",
    };
    return NextResponse.json({}, { status: 204, headers: preflightHeaders });
  }

  let response;

  const isStaticResource =
    pathname.startsWith("/_next/") || pathname === "/favicon.ico";

  // ✅ Determine if the route is public
  const isPublicRoute =
    pathname.startsWith("/api/") || PUBLIC_ROUTES.includes(pathname);

  if (isStaticResource || isPublicRoute) {
    response = NextResponse.next();
  } else {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      response = NextResponse.redirect(new URL("/sign-in", req.url));
    } else {
      try {
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        response = NextResponse.next();
      } catch (err) {
        console.error("Invalid JWT:", err);
        response = NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
  }

  // ✅ Apply CORS headers
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  response.headers.set("Vary", "Origin");

  return response;
}

// ✅ Match all relevant paths
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)", "/api/:path*"],
};
