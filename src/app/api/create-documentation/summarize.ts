import OpenAI from "openai";

const client: OpenAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function summarizeFile(rawCode: string): Promise<string> {
  console.log(`Summarizing file: ${rawCode.slice(0, 50)}...`);
  const chatCompletion: OpenAICompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Generate documentation for this file in markdown format"
      },
      {
        role: "user",
        content: rawCode
      }
    ],
    model: "gpt-4o-mini",
  })
  console.log("File summary completed");
  return chatCompletion.choices[0].message.content;
}

async function summarizeAllFiles(fileNodes: FileNode[]): Promise<FileNode[]> {
  console.log("Starting to summarize all files...");
  let queue: FileNode[] = [...fileNodes];
  console.log(`Initial queue length: ${queue.length}`);

  while (queue.length > 0) {
    const current: FileNode | undefined = queue.shift();
    if (!current) continue;

    console.log(`Processing ${current.path}...`);
    if (typeof current.content === "string") {
      console.log(`Summarizing file content for ${current.path}...`);
      current.content = await summarizeFile(current.content);
    } else {
      console.log(`Found directory ${current.path} with ${current.content.length} items! Adding items to queue.`);
      queue = [...queue, ...current.content];
    }
    console.log(`Remaining files in queue: ${queue.length}`);
  }

  console.log("Completed summarizing all files!");
  return fileNodes;
}

async function summarizeOverall(githubRepo: FileNode[]): Promise<string> {
  console.log("Starting overall summary...");
  const chatCompletion: OpenAICompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Generate documentation for this file in markdown format"
      },
      {
        role: "user",
        content: JSON.stringify(githubRepo)
      }
    ],
    model: "gpt-4o-mini",
  })
  console.log("Overall summary completed");
  return chatCompletion.choices[0].message.content;
}

export async function summarizeCodebase(githubRepo: FileNode[]): Promise<Summaries> {
  console.log("Starting codebase summarization...");
  
  // Format download as JavaScript object
  const githubRepoCopy: FileNode[] = JSON.parse(JSON.stringify(githubRepo));

  // Summarize each file
  console.log("Beginning individual file summaries...");
  const fileSummaries: FileNode[] = await summarizeAllFiles(githubRepo);

  // Summarize the overall document
  console.log("Beginning overall summary...");
  const overallSummary: string = await summarizeOverall(githubRepoCopy);

  // Return both summaries
  const summaries: Summaries = {
    overall: overallSummary,
    individual: fileSummaries
  };
  console.log("Summarization complete!");
  return summaries;
}
