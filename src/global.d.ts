interface FileNode {
  path: string
  type: "blob" | "tree"
  content: FileNode[] | string
}

interface GithubRepo {
  fileNodes: FileNode[]
}

interface Summaries {
  overall: string,
  individual: GithubRepo
}

type OpenAICompletion = OpenAI.Chat.Completions.ChatCompletion;
