import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import Cors from "cors";

// Initialize CORS middleware
const cors = Cors({
  origin: "*", // Change this to your frontend app URL or '*' for all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
});

// Helper function to run CORS middleware with Next.js types
const runCors = (req: NextRequest, res: NextResponse): Promise<void> => {
  return new Promise((resolve, reject) => {
    const corsRequest = {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    };

    // Create a custom response object to use with the CORS middleware
    const customRes = {
      statusCode: res.status,
      setHeader: (key: string, value: string) => res.headers.set(key, value),
      end: () => {}, // No-op for ending the response
    };

    cors(corsRequest, customRes, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve();
    });
  });
};

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"]; // Add your public routes here
const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle CORS for all routes
  try {
    await runCors(req, NextResponse.next());
  } catch (err) {
    console.error("CORS Error:", err);
    return new Response("CORS error", { status: 500 });
  }

  // Allow public routes (no need to check JWT)
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Redirect to sign-in page if no token
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Validate JWT
  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    // Proceed to the next middleware or route if token is valid
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid JWT:", err);
    // Redirect to sign-in page if token is invalid
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

// Apply middleware to all routes except API routes, static assets, and image routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
