import OpenAI from 'openai';

const client: OpenAI = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function summarizeFile(rawCode: string): Promise<string> {
    console.log('Summarizing file:', rawCode.slice(0, 100) + '...'); // Show start of file content
    const chatCompletion: OpenAICompletion = await client.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'Generate documentation for this file in markdown format'
            },
            {
                role: 'user',
                content: rawCode
            }
        ],
        model: 'gpt-4o-mini',
    })
    console.log('File summary completed');
    return chatCompletion.choices[0].message.content;
}

async function summarizeAllFiles(githubRepo: GithubRepo): Promise<GithubRepo> {
    console.log('Starting to summarize all files...');
    const queue: FileNode[] = [...githubRepo.fileNodes];
    console.log('Initial queue length:', queue.length);

    while (queue.length > 0) {
        const current: FileNode | undefined = queue.shift();
        if (!current) continue;

        console.log('Processing:', current.path);
        if (typeof current.content === "string") {
            console.log('Summarizing file content for:', current.path);
            current.content = await summarizeFile(current.content);
        } else {
            console.log('Found directory:', current.path, 'with', current.content.length, 'items');
            queue.push.apply(queue, current.content);
        }
        console.log('Remaining files in queue:', queue.length);
    }

    console.log('Completed summarizing all files');
    return githubRepo;
}

async function summarizeOverall(githubRepo: GithubRepo): Promise<string> {
    console.log('Starting overall summary...');
    const chatCompletion: OpenAICompletion = await client.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'Generate documentation for this file in markdown format'
            },
            {
                role: 'user',
                content: JSON.stringify(githubRepo)
            }
        ],
        model: 'gpt-4o-mini',
    })
    console.log('Overall summary completed');
    return chatCompletion.choices[0].message.content;
}

// TODO: delete when done testing
const testData: GithubRepo = {
    fileNodes: [
        {
            path: "src/app/page.tsx",
            type: "blob",
            content: "page content here"
        },
        {
            path: "src/app/api",
            type: "tree",
            content: [
                {
                    path: "src/app/api/create-documentation/summarize.ts",
                    type: "blob",
                    content: "api content here"
                }
            ]
        }
    ]
}

export async function summarizeCodebase(githubRepo: GithubRepo): Promise<Summaries> {
    console.log('Starting codebase summarization...');
    // Format download as JavaScript object
    const githubRepoCopy: GithubRepo = JSON.parse(JSON.stringify(githubRepo));

    // Summarize each file
    console.log('Beginning individual file summaries...');
    const fileSummaries: GithubRepo = await summarizeAllFiles(githubRepo);

    // Summarize the overall document
    console.log('Beginning overall summary...');
    const overallSummary: string = await summarizeOverall(githubRepoCopy);

    console.log('Summarization complete!');
    // Return both summaries
    const summaries: Summaries = {
        overall: overallSummary,
        individual: githubRepo
    };
    return summaries;
}
