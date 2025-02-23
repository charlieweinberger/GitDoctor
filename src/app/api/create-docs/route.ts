import { NextResponse } from "next/server";

import { summarizeCodebase } from "./summarize";
import getRepo from "./getRepo";

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
