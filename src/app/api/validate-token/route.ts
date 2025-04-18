import { NextResponse } from "next/server";
import { validateResetToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const { valid } = validateResetToken(token);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const passwordReset = await prisma.passwordResetToken.findFirst({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!passwordReset) {
      return NextResponse.json(
        { error: "Token not found or already used" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Token is valid",
      user: passwordReset.user,
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
