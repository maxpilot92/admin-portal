import { generateResetToken } from "@/lib/jwt";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const data = await req.json();

  const email = data.email;
  console.log("data:", data);
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
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/auth/reset-password/${token}`;
  const sentInvite = await sendEmail(email, resetUrl);

  if (!sentInvite) {
    return Response.json({ message: "Error sending email" }, { status: 500 });
  }

  return Response.json({ message: "Invitation sent" });
}
