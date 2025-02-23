"use server";

import axios from 'axios'

// Add type definition
interface FileNode {
  path: string
  type: "blob" | "tree"
  content: FileNode[] | string
}

interface GithubRepo {
  fileNodes: FileNode[]
}

function convertToFileNodes(files: any, basePath: string = ''): FileNode[] {
  const fileNodes: FileNode[] = []

  for (const [name, content] of Object.entries(files)) {
    const path = basePath ? `${basePath}/${name}` : name

    if (typeof content === 'object' && content !== null) {
      // This is a directory
      fileNodes.push({
        path,
        type: 'tree',
        content: convertToFileNodes(content, path)
      })
    } else {
      // This is a file
      fileNodes.push({
        path,
        type: 'blob',
        content: content || ''
      })
    }
  }

  return fileNodes
}

export async function downloadRepo(url: string): Promise<GithubRepo> {
  console.log('Starting repository download for URL:', url)
  let repoOwner: string | undefined = undefined
  let repoName: string | undefined = undefined
  let repoBranch: string | undefined = undefined

  if (!url.includes('github.com')) {
    throw new Error('Invalid GitHub URL')
  }

  if (url) {
    const urlParts = url.split('github.com/')[1]?.split('/') || []
    repoOwner = urlParts[0]
    repoName = urlParts[1]
    console.log('Parsed repository details:', { repoOwner, repoName })
  }

  if (!repoOwner || !repoName) {
    throw new Error('Invalid repository URL format')
  }

  const repoResponse = await axios.get(
    `https://api.github.com/repos/${repoOwner}/${repoName}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }
    })
  repoBranch = repoResponse?.data?.default_branch
  console.log('Retrieved default branch:', repoBranch)

  const tempFiles: Record<string, any> = {}

  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${repoBranch}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        }
      }
    )
    console.log('Retrieved repository tree with', data?.tree?.length || 0, 'items')

    for (const item of data?.tree || []) {
      // Only process files (blobs), skip directories
      if (item.type !== 'blob') continue;
      console.log('Processing file:', item.path)

      const dirIndex = item.path.split('/')
      let currentLevel = tempFiles

      for (let i = 0; i < dirIndex.length; i++) {
        const part = dirIndex[i]

        if (i === dirIndex.length - 1) {
          try {
            const response = await axios.get(
              `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${repoBranch}/${item.path}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                }
              }
            )
            currentLevel[part] = response.data
          } catch (error) {
            console.error(`Failed to fetch file ${item.path}:`, error)
            currentLevel[part] = ''
          }
        } else {
          if (!currentLevel[part]) {
            currentLevel[part] = {}
          }
          currentLevel = currentLevel[part]
        }
      }
    }
  } catch (err) {
    console.error("Unable to fetch repository structure:", err)
    throw err
  }

  const result: GithubRepo = {
    fileNodes: convertToFileNodes(tempFiles)
  }
  console.log('Finished processing repository. Total file nodes:', result.fileNodes.length)

  return result
}