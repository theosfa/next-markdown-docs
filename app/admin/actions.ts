// 'use server';

// import fs from 'fs';
// import path from 'path';
// import { slugify } from '@/lib/slugify'

// const postsDir = path.join(process.cwd(), 'posts');

// export async function readMarkdownFile(filePath: string) {
//   const absPath = path.join(postsDir, filePath);
//   return fs.readFileSync(absPath, 'utf8');
// }

// export async function writeMarkdownFile(filePath: string, content: string) {
//   const absPath = path.join(postsDir, filePath);
//   fs.mkdirSync(path.dirname(absPath), { recursive: true });
//   fs.writeFileSync(absPath, content, 'utf8');
// }

// export async function deleteMarkdownFile(filePath: string) {
//   const absPath = path.join(postsDir, filePath);
//   fs.unlinkSync(absPath);
// }


// const postsDirectory = path.join(process.cwd(), 'posts');

// export async function listMarkdownFiles(): Promise<string[]> {
//   function walk(dir: string): string[] {
//     const result: string[] = [];
//     for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
//       const fullPath = path.join(dir, entry.name);
//       if (entry.isDirectory()) {
//         result.push(...walk(fullPath));
//       } else if (entry.isFile() && entry.name.endsWith('.md')) {
//         const relativePath = path.relative(postsDirectory, fullPath);
//         result.push(relativePath.replace(/\\/g, '/'));
//       }
//     }
//     return result;
//   }
//   return walk(postsDirectory);
// }


// export async function createAction(formData: FormData) {
//   const title = formData.get('title') as string;
//   const content = formData.get('content') as string;

//   const slug = slugify(title);
//   const filePath = `${slug}.md`;

//   const markdownWithFrontmatter = `---\ntitle: ${title}\n---\n\n${content}`;

//   await writeMarkdownFile(filePath, markdownWithFrontmatter);

//   // redirect or return as needed
// }

// export async function updateAction(formData: FormData) {
//   const id = formData.get('id') as string; // the filename (like 'my-post.md')
//   const title = formData.get('title') as string;
//   const content = formData.get('content') as string;

//   const markdownWithFrontmatter = `---\ntitle: ${title}\n---\n\n${content}`;

//   await writeMarkdownFile(id, markdownWithFrontmatter);

//   // redirect or return as needed
// }
// app/admin/actions.ts
"use server";

import { slugify } from "@/lib/slugify";
import {
  writeFile,
  getFileContent,
  deleteFile,
  listRepoFiles, // ✅ Add this
} from "@/lib/github";

export async function createAction(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const filename = `${slugify(title)}.md`;
  const body = `---\ntitle: ${title}\n---\n\n${content}`;
  await writeFile(`posts/${filename}`, body, undefined, `Create ${filename}`);
}

export async function updateAction(formData: FormData) {
  const id = formData.get("id") as string; // e.g. "posts/foo.md"
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const { sha } = await getFileContent(id);
  const body = `---\ntitle: ${title}\n---\n\n${content}`;
  await writeFile(id, body, sha, `Update ${id}`);
}

export async function deleteMarkdownFile(path: string) {
  const { sha } = await getFileContent(path);
  await deleteFile(path, sha, `Delete ${path}`);
}

export async function listMarkdownFiles() {
  const files = await listRepoFiles(); // returns {path} strings
  return files.map(f => f.path.replace(/^posts\//, ""));
}
