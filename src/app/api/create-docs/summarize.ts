
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const gemini: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function summarizeFile(rawCode: string): Promise<string> {
  console.log(`Summarizing file: ${rawCode.slice(0, 50)}...`);
  const completion = await gemini.generateContent(`Generate documentation for this file in markdown format: ${rawCode}`);
  return completion.response.text();
}

async function summarizeAllFiles(parsedRepo: ParsedRepo): Promise<ParsedRepo> {
  console.log("Starting to summarize all files...");
  let queue: ParsedRepo = [...parsedRepo];
  console.log(`Initial queue length: ${queue.length}`);

  while (queue.length > 0) {
    const current: ParsedRepoNode | undefined = queue.shift();
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
  return parsedRepo;
}

async function summarizeOverall(parsedRepo: ParsedRepo): Promise<string> {
  console.log("Starting overall summary...");
  const completion = await gemini.generateContent(
    `Generate documentation for this file in markdown format: ${JSON.stringify(parsedRepo)}`);
  return completion.response.text();
}

export default async function summarizeCodebase(parsedRepo: ParsedRepo): Promise<Summaries> {

  console.log("Starting codebase summarization...");
  const repoCopy: ParsedRepo = JSON.parse(JSON.stringify(parsedRepo));
  
  console.log("Beginning individual file summaries...");
  const individualSummaries: ParsedRepo = await summarizeAllFiles(parsedRepo);
  
  console.log("Beginning overall summary...");
  const overallSummary: string = await summarizeOverall(repoCopy);
  
  const summaries: Summaries = {
    overall: overallSummary,
    parsedRepo: individualSummaries
  };
  console.log("Summarization complete:");
  console.log(summaries);
  return summaries;

}
