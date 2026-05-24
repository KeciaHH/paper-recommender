"use server";

import { redirect } from "next/navigation";
import { setAuthCookie, verifyPassword } from "../../lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect("/login?error=1");
  }

  setAuthCookie();
  redirect("/");
}
