import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "dnv_admin";

export function adminPassword(): string {
  // Default password for first-run/local; override with ADMIN_PASSWORD in env.
  return process.env.ADMIN_PASSWORD || "change-me";
}

function sessionToken(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || adminPassword();
  return crypto.createHash("sha256").update(`dnv:${secret}`).digest("hex");
}

export async function setAdminCookie() {
  const jar = await cookies();
  jar.set(COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearAdminCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === sessionToken();
}
