// Raw Repo

interface RawRepoNode {
  path: string
  mode: string
  type: "tree" | "blob"
  sha: string
  size: number
  url: string
}

interface RawRepo {
  sha: string
  url: string
  tree: RawRepoNode[]
  truncated: boolean
}

interface RawRepoInfo {
  repoOwner: string
  repoName: string
  repoDefaultBranch: string
  rawRepo: RawRepo
}

type RawRepoRecord = Record<string, string>;

// Parsed Repo

interface ParsedRepoNode {
  path: string
  type: "tree" | "blob"
  content: ParsedRepo | string
}

type ParsedRepo = ParsedRepoNode[];

// Summaries

interface Summaries {
  overall: string,
  parsedRepo: ParsedRepo
}