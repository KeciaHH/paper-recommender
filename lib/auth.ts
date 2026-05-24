import crypto from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "paper_recommender_session";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function configuredPasswordHash() {
  if (process.env.APP_PASSWORD_SHA256) {
    return process.env.APP_PASSWORD_SHA256;
  }
  if (process.env.APP_PASSWORD) {
    return sha256(process.env.APP_PASSWORD);
  }
  return sha256("change-me");
}

export function verifyPassword(password: string) {
  return sha256(password) === configuredPasswordHash();
}

export function sessionToken() {
  return sha256(`session:${configuredPasswordHash()}`);
}

export function isAuthenticated() {
  return cookies().get(cookieName)?.value === sessionToken();
}

export function setAuthCookie() {
  cookies().set(cookieName, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearAuthCookie() {
  cookies().delete(cookieName);
}
