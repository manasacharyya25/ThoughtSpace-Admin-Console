import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { searchPexelsPhotos } from "@/lib/pexels";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  if (!query) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 });
  }

  if (query.length > 120) {
    return NextResponse.json({ error: "Query too long" }, { status: 400 });
  }

  try {
    const apiKey = env.pexelsApiKey();
    const result = await searchPexelsPhotos(
      apiKey,
      query,
      Number.isFinite(page) && page > 0 ? page : 1
    );
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Pexels search failed";
    const status = message.includes("PEXELS_API_KEY") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
