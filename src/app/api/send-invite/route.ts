// app/api/auth/invite-user/route.ts
import { generateResetToken } from "@/lib/jwt";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return Response.json({ message: "Email is required" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: { status: "pending", email },
  });

  const token = generateResetToken(user.id);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // 🔐 Optional: Store token in DB
  const pass = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  });

  console.log("Password reset token created:", pass);

  const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/reset-password/${token}`;
  await sendEmail(email, resetUrl);

  return Response.json({ message: "Invitation sent" });
}
