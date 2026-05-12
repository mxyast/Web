import { NextResponse } from "next/server";
import { getSearchSuggestions } from "@eticaret/database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const platform = (searchParams.get("p") as "B2C" | "B2B") || "B2B";

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await getSearchSuggestions(query, platform);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Suggestions API Error:", error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
