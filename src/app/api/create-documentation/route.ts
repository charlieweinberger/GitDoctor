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
    // console.log(githubRepo);
    // let githubRepo: GithubRepo = {
    //     fileNodes: [
    //         {
    //             path: "/doc",
    //             type: "tree" as const,
    //             content: [
    //                 {
    //                     path: "/doc/test",
    //                     type: "tree" as const,
    //                     content: [
    //                         {
    //                             path: "/doc/test/test1.1",
    //                             type: "blob" as const,
    //                             content: "## Hello world \n This is a markdown filea asdfasdfasdf",
    //                         },
    //                     ]
    //                 },
    //                 {
    //                     path: "/doc/test1",
    //                     type: "blob" as const,
    //                     content: "## Hello world \n This is a markdown file",
    //                 },
    //                 {
    //                     path: "/doc/test2",
    //                     type: "blob" as const,
    //                     content: "## Hello world \n This is a markdown file",
    //                 },
    //                 {
    //                     path: "/doc/test3",
    //                     type: "blob" as const,
    //                     content: "## Hello world \n This is a markdown file",
    //                 },
    //             ],
    //         },
    //     ]
    // }
    const summaries: Summaries = await summarizeCodebase(githubRepo);

    console.log(summaries)


    return NextResponse.json({ summaries }, { status: 200 });
}
