import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../lib/auth";
import { saveRating } from "../../../lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  await saveRating({
    paperId: String(body.paperId),
    value: Number(body.value),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    note: body.note ? String(body.note) : undefined,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
