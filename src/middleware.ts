import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ✅ Handle CORS differently for production
  const origin = req.headers.get("origin");
  const allowedOrigins =
    process.env.NODE_ENV === "development" ? ["*"] : ["http://3.107.67.84"];

  if (
    origin &&
    (allowedOrigins.includes("*") || allowedOrigins.includes(origin))
  ) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
  }

  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // Only set credentials if not using wildcard
  if (!allowedOrigins.includes("*")) {
    res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // ✅ Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: Object.fromEntries(res.headers),
    });
  }

  // ✅ Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return res;
  }

  // ✅ Check JWT token for protected routes
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return res;
  } catch (err) {
    console.error("Invalid JWT:", err);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
