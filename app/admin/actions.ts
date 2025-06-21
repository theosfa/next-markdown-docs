'use server';

import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'posts');

// export async function listMarkdownFiles(): Promise<{ name: string; fullPath: string }[]> {
//   function walk(dir: string): { name: string; fullPath: string }[] {
//     const entries = fs.readdirSync(dir, { withFileTypes: true });
//     return entries.flatMap((entry) => {
//       const fullPath = path.join(dir, entry.name);
//       return entry.isDirectory()
//         ? walk(fullPath)
//         : entry.name.endsWith('.md')
//         ? [{ name: path.relative(postsDir, fullPath), fullPath }]
//         : [];
//     });
//   }
//   return walk(postsDir);
// }

export async function readMarkdownFile(filePath: string) {
  const absPath = path.join(postsDir, filePath);
  return fs.readFileSync(absPath, 'utf8');
}

export async function writeMarkdownFile(filePath: string, content: string) {
  const absPath = path.join(postsDir, filePath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, content, 'utf8');
}

export async function deleteMarkdownFile(filePath: string) {
  const absPath = path.join(postsDir, filePath);
  fs.unlinkSync(absPath);
}


const postsDirectory = path.join(process.cwd(), 'posts');

export async function listMarkdownFiles(): Promise<string[]> {
  function walk(dir: string): string[] {
    const result: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        result.push(...walk(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const relativePath = path.relative(postsDirectory, fullPath);
        result.push(relativePath.replace(/\\/g, '/'));
      }
    }
    return result;
  }
  return walk(postsDirectory);
}
