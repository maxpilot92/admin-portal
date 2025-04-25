import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"]; // Define public routes
const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ✅ Set CORS headers
  const origin = req.headers.get("origin") || "*";
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH"
  );
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  res.headers.set("Access-Control-Allow-Credentials", "true");

  // ✅ Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: res.headers,
    });
  }

  // ✅ Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return res;
  }

  // ✅ Check JWT token
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

// ✅ Apply middleware to all routes except static & API
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
