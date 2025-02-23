import { NextResponse } from "next/server";

type FileNode = {
    path: string;
    type: "tree" | "blob";
    content: string | FileNode[];
}

type GithubRepo = {
    fileNodes: FileNode[];
}

import { summarizeCodebase } from "./summarize";
import { downloadRepo } from "./downloadRepo";

// To handle a GET request to /api
export async function GET(request: Request) {
    const params = new URL(request.url).searchParams;
    const url = params.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
    }

    const githubRepo: GithubRepo = await downloadRepo(url);
    console.log(githubRepo);
    const summaries: Summaries = await summarizeCodebase(githubRepo);


    return NextResponse.json({ summaries }, { status: 200 });
}
