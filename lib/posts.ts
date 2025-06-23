import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import remarkHtml from "remark-html";
import 'highlight.js/styles/github.css'; // ← this imports GitHub style



const postsDirectory = path.join(process.cwd(), "posts");


/**
 * Recursively builds the sidebar tree with full folder structure
 */


/**
 * Resolves a full file path by slug array (e.g. ['folder', 'file'])
 */
export function findMarkdownFileBySlug(slugSegments: string[]): string | null {
  function walk(dir: string, baseSegments: string[] = []): string | null {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const nextBase = [...baseSegments, slugify(entry.name)];
        const found = walk(fullPath, nextBase);
        if (found) return found;
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        const filename = entry.name.replace(/\.md$/, "");
        const currentSlug = [...baseSegments, slugify(filename)];

        if (currentSlug.join("/") === slugSegments.join("/")) {
          return fullPath;
        }
      }
    }

    return null;
  }

  return walk(postsDirectory);
}


/**
 * Loads post content by slug segments
 */


// lib/posts.ts
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { listRepoFiles, getFileContent } from "./github";
import { slugify } from "@/lib/slugify";

export type SidebarNode = {
  type: "folder" | "file";
  name: string;
  title?: string;
  url?: string;
  children?: SidebarNode[];
};

// Internal type for organizing files


type InternalNode = {
  rawName: string;
  fullPath: string;
  slugParts: string[];
  title: string;
};

export async function buildSidebarTree(): Promise<SidebarNode[]> {
  // 1. List all markdown files in the repo
  const files = await listRepoFiles(); // [{ path: "posts/foo.md" }, ...]

  // 2. Load frontmatter titles for each
  const internalNodes: InternalNode[] = await Promise.all(
    files
      .filter((f) => f.path.endsWith(".md"))
      .map(async (f) => {
        // path relative to posts/
        const cleaned = f.path.replace(/^posts\//, "");
        const parts = cleaned.split("/");
        const filename = parts.pop()!;                // e.g. "hello.md"
        const slugParts = parts.map(slugify);         // e.g. ["nested"]
        const name = filename.replace(/\.md$/, "");   // "hello"
        
        // fetch and parse frontmatter
        const { content } = await getFileContent(f.path);
        const { data } = matter(content);

        return {
          rawName: name,
          fullPath: f.path,
          slugParts,
          title: (data.title as string) ?? name,  // use frontmatter title if present
        };
      })
  );

  // 3. Build a map by folder
  const treeMap: Record<string, InternalNode[]> = {};
  for (const node of internalNodes) {
    const folderKey = node.slugParts.join("/");
    ;(treeMap[folderKey] ||= []).push(node);
  }

  // 4. Recursive builder
  function buildNodes(base = ""): SidebarNode[] {
    const nodes: SidebarNode[] = [];

    // files at this level
    (treeMap[base] || []).forEach((file) => {
      const slug = slugify(file.rawName);
      const url = "/" + [...file.slugParts, slug].join("/");
      nodes.push({
        type: "file",
        name: file.rawName,
        title: file.title,
        url,
      });
    });

    // subfolders
    const childFolders = Object.keys(treeMap)
      .filter((k) => k.startsWith(base === "" ? "" : base + "/"))
      .map((k) => k.split("/")[base === "" ? 0 : base.split("/").length])
      .filter((v, i, a) => !!v && a.indexOf(v) === i);

    childFolders.forEach((folder) => {
      const path = base === "" ? folder : `${base}/${folder}`;
      nodes.push({
        type: "folder",
        name: folder,
        title: folder,
        children: buildNodes(path),
      });
    });

    return nodes;
  }

  return buildNodes();
}
export async function getSidebarTree(): Promise<SidebarNode[]> {
  const files = await listRepoFiles(); // from GitHub repo
  return buildSidebarTree(files);
}

export async function getPostData(slug: string[]) {
  console.log("getPostData", slug);
  const filename = findMarkdownFileBySlug(slug);
  const postsDir = "/var/task/posts";

  if (!filename) {
    throw new Error(`Markdown file not found for slug: ${slug.join("/")}`);
  }

  let urlPath = filename.startsWith(postsDir)
    ? filename.slice(postsDir.length) // yields "/Another folder/hello.md"
    : filename;
  console.log("Found file:", urlPath);
  const path = `posts${urlPath}`;
  const { content } = await getFileContent(path);
  const { data, content: rawContent } = matter(content);

  const processed = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(rawContent);

  return {
    title: data.title ?? slug.at(-1) ?? "Untitled",
    contentHtml: processed.toString(),
  };
}
