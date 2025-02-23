import { NextResponse } from "next/server";

import { summarizeCodebase } from "./summarize";
import { downloadRepo } from "./downloadRepo";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const url = params.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  console.log(`--------------------- ${url}`);

  const fileNodes: FileNode[] = await downloadRepo(url);
  const summaries: Summaries = await summarizeCodebase(fileNodes);

  return NextResponse.json({ summaries }, { status: 200 });
}
