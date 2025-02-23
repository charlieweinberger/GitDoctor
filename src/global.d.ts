interface FileNode {
  path: string
  type: "tree" | "blob"
  content: FileNode[] | string
}

interface Summaries {
  overall: string,
  individual: FileNode[]
}

type OpenAICompletion = OpenAI.Chat.Completions.ChatCompletion;
