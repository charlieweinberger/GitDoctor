import { NextResponse } from "next/server";

import getRepo from "./getRepo";
import summarizeCodebase from "./summarize";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const url = params.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }
  const parsedRepo: ParsedRepo = await getRepo(url);
  const summaries: Summaries = await summarizeCodebase(parsedRepo);
  return NextResponse.json({ summaries }, { status: 200 });
}
