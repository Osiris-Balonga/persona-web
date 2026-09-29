import { NextRequest, NextResponse } from "next/server";
import { getUseCasePeople, resolveUseCaseCountry } from "@/lib/use-case-people";

export async function GET(request: NextRequest) {
  const country = resolveUseCaseCountry(
    request.headers.get("x-vercel-ip-country") ??
      request.nextUrl.searchParams.get("country"),
  );
  try {
    const people = await getUseCasePeople(country);
    return NextResponse.json(
      { country, people },
      {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "profiles_unavailable" },
      { status: 503 },
    );
  }
}
