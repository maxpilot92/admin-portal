// lib/jwt.ts
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateResetToken(userId: string, usecase?: string) {
  if (usecase === "sign-in") {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
    return token;
  }
  const jti = crypto.randomBytes(16).toString("hex");
  const token = jwt.sign({ userId, jti }, JWT_SECRET, { expiresIn: "24h" });
  return token;
}

export function validateResetToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error };
  }
}
