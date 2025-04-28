import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up", "/api/sign-in", "/api/blog"];
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

// CORS options configuration
const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check the origin from the request
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests (OPTIONS)
  if (req.method === "OPTIONS") {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions,
      Vary: "Origin",
    };
    return NextResponse.json({}, { status: 204, headers: preflightHeaders });
  }

  // For all other requests, prepare the response
  let response;

  // Check if static resource or public route - allow without auth
  const isStaticResource =
    pathname.startsWith("/_next/") || pathname === "/favicon.ico";
  if (
    isStaticResource ||
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    response = NextResponse.next();
  }
  // Auth required - check for token
  else {
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

  // Apply CORS headers to all responses
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  // Add all CORS headers
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add Vary header for proper caching
  response.headers.set("Vary", "Origin");

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // Also match API routes
    "/api/:path*",
  ],
};
