"use server";

import { fetchGET } from '@/lib/utils';

async function fetchRepoData(url: string): Promise<RawRepoInfo> {

  console.log(`Attempting to get repository data for URL: ${url}...`);

  if (!url || !url.includes("github.com")) {
    throw new Error("Invalid GitHub URL");
  }

  const urlParts: string[] = url.split("github.com/")[1]?.split('/') || [];
  const repoOwner: string = urlParts[0];
  const repoName: string = urlParts[1];

  if (!repoOwner || !repoName) {
    throw new Error("Invalid repository URL format");
  }

  const repoInfo = await fetchGET(`https://api.github.com/repos/${repoOwner}/${repoName}`);
  const repoDefaultBranch: string = repoInfo?.default_branch ?? null;

  if (!repoDefaultBranch) {
    throw new Error("Invalid repository branch");
  }

  const rawRepo: RawRepo | null = await fetchGET(`https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${repoDefaultBranch}?recursive=1`);

  if (!rawRepo) {
    throw new Error("Error fetching repository.");
  }

  const rawRepoInfo: RawRepoInfo = {
    repoOwner,
    repoName,
    repoDefaultBranch,
    rawRepo
  };
  console.log("\nrawRepoInfo:");
  console.log(rawRepoInfo);
  console.log("");

  return rawRepoInfo;

}

// TODO: fix this function
async function parseRepoData({
  repoOwner,
  repoName,
  repoDefaultBranch,
  rawRepo
}: RawRepoInfo): Promise<ParsedRepo> {

  const tempFiles: Record<string, any> = {};

  for (const rawNode of rawRepo.tree) {
    
    // Only process files (blobs), skip directories
    if (rawNode.type === "tree") {
      continue;
    }
    
    console.log(`Processing file: ${rawNode.path}...`);

    const dirIndex: string[] = rawNode.path.split('/');
    let currentLevel: any = tempFiles;

    for (let i = 0; i < dirIndex.length; i++) {
      const part = dirIndex[i];
      if (i < dirIndex.length - 1) {
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      } else {
        try {
          currentLevel[part] = await fetchGET(`https://raw.githubusercontent.com/${repoOwner}/${repoName}/${repoDefaultBranch}/${rawNode.path}`);
        } catch (error) {
          console.error(`Failed to fetch file ${rawNode.path}: ${error}`);
          currentLevel[part] = "";
        }
      }
    }
  }

  const result: ParsedRepo = convertToParsedRepo(tempFiles);
  console.log(`Finished processing repository. Total file nodes: ${result.length}`);
  return result;

}

// TODO: fix this function
function convertToParsedRepo(files, basePath: string = ""): ParsedRepo {
  const fileNodes: ParsedRepo = [];

  for (const [name, content] of Object.entries(files)) {
    const path = basePath ? `${basePath}/${name}` : name;

    if (typeof content === "object" && content !== null) {
      // This is a directory
      fileNodes.push({
        path,
        type: "tree",
        content: convertToParsedRepo(content, path)
      });
    } else {
      // This is a file
      fileNodes.push({
        path,
        type: "blob",
        content: (typeof content === "string") ? content : ""
      });
    }
  }

  return fileNodes;
}

export default async function getRepo(url: string): Promise<ParsedRepo> {
  // TODO: convert RawRepo to ParsedRepo
  const rawRepo: RawRepo = await fetchRepoData(url);
  return await parseRepoData(rawRepo);
}
