import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const repoFullName = process.env.GITHUB_REPO!; // e.g. "theosfa/next-markdown-docs"
const [owner, repo] = repoFullName.split("/");
const branch = process.env.GITHUB_BRANCH ?? "main";

const basePath = "posts"; // all markdowns are stored here

// 🔄 List all files in /posts recursively
export async function listRepoFiles(): Promise<{ path: string }[]> {
  const res = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: basePath,
    ref: branch,
  });

  async function flatten(dir: string): Promise<{ path: string }[]> {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: dir,
      ref: branch,
    });

    if (!Array.isArray(data)) return [];

    const files: { path: string }[] = [];

    for (const item of data) {
      if (item.type === "file") {
        files.push({ path: item.path });
      } else if (item.type === "dir") {
        const sub = await flatten(item.path);
        files.push(...sub);
      }
    }

    return files;
  }

  if (Array.isArray(res.data)) {
    const allFiles: { path: string }[] = [];

    for (const entry of res.data) {
      if (entry.type === "file") {
        allFiles.push({ path: entry.path });
      } else if (entry.type === "dir") {
        const nested = await flatten(entry.path);
        allFiles.push(...nested);
      }
    }

    return allFiles;
  }

  return [];
}

// 📖 Read one file
export async function getFileContent(path: string): Promise<{ content: string; sha: string }> {
  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });

  if (!("content" in data)) throw new Error("File has no content");
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

// ✍️ Write (create or update) file
export async function writeFile(path: string, content: string, sha?: string, message?: string) {
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: message ?? `Update ${path}`,
    content: Buffer.from(content).toString("base64"),
    sha,
    branch,
  });
}

// 🗑️ Delete a file
export async function deleteFile(path: string, sha: string, message?: string) {
  await octokit.rest.repos.deleteFile({
    owner,
    repo,
    path,
    message: message ?? `Delete ${path}`,
    sha,
    branch,
  });
}
