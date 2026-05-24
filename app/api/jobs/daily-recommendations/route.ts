import { NextResponse } from "next/server";
import { generateDailyRecommendations } from "../../../../scripts/daily-recommend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const day = await generateDailyRecommendations();
  return NextResponse.json(day);
}
