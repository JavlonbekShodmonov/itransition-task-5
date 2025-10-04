// src/app/lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev_secret");

import type { JWTPayload } from "jose";

export async function signToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    console.log("✅ Verified token payload:", payload);
    return payload;
  } catch (err) {
    console.error("❌ JWT verify failed:", err);
    return null;
  }
}
