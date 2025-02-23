import OpenAI from 'openai';

const client: OpenAI = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function summarizeFile(rawCode: string): Promise<string> {
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
    return chatCompletion.choices[0].message.content;
}

async function summarizeAllFiles(githubRepo: GithubRepo): Promise<GithubRepo> {

    const queue: FileNode[] = [...githubRepo.fileNodes];

    while (queue.length > 0) {

        const current: FileNode | undefined = queue.shift();
        if (!current) continue;

        if (typeof current.content === "string") {
            current.content = await summarizeFile(current.content);
        } else {
            queue.push.apply(queue, current.content);
        }

    }

    return githubRepo;
}

async function summarizeOverall(githubRepo: GithubRepo): Promise<string> {
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
    // Format download as JavaScript object
    const githubRepoCopy: GithubRepo = JSON.parse(JSON.stringify(githubRepo));

    // Summarize each file
    const fileSummaries: GithubRepo = await summarizeAllFiles(githubRepo);

    // Summarize the overall document
    const overallSummary: string = await summarizeOverall(githubRepoCopy);

    // Return both summaries
    const summaries: Summaries = {
        overall: overallSummary,
        individual: githubRepo
    };
    return summaries;

}
