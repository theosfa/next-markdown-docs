// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";
// import { remark } from "remark";
// import html from "remark-html";
// import remarkHtml from "remark-html";
// import rehypeHighlight from "rehype-highlight";
// import { unified } from "unified";
// import remarkParse from "remark-parse";
// import remarkRehype from "remark-rehype";
// import rehypeStringify from "rehype-stringify";
// import 'highlight.js/styles/github.css'; // ← this imports GitHub style
// import { slugify } from "@/lib/slugify"; // Adjust the import path as needed



// const postsDirectory = path.join(process.cwd(), "posts");

// type SidebarNode = {
//   type: "folder" | "file";
//   name: string;
//   url?: string;
//   title?: string;
//   children?: SidebarNode[];
// };

// /**
//  * Recursively builds the sidebar tree with full folder structure
//  */
// function buildSidebarTree(dir: string, base = ""): SidebarNode[] {
//   const entries = fs.readdirSync(dir, { withFileTypes: true });
//   const nodes: SidebarNode[] = [];

//   for (const entry of entries) {
//     const fullPath = path.join(dir, entry.name);
//     const isDir = entry.isDirectory();
//     const isMarkdown = entry.isFile() && entry.name.endsWith(".md");

//     if (isDir) {
//       const slug = slugify(entry.name);
//       const subTree = buildSidebarTree(fullPath, path.join(base, slug));
//       nodes.push({
//         type: "folder",
//         name: entry.name,
//         children: subTree,
//       });
//     }

//     if (isMarkdown) {
//       const fileContents = fs.readFileSync(fullPath, "utf8");
//       const { data } = matter(fileContents);

//       const filename = entry.name.replace(/\.md$/, "");
//       const slugSegment = slugify(filename);
//       const slugPath = path.join(base, slugSegment).replace(/\\/g, "/");

//       nodes.push({
//         type: "file",
//         name: filename,
//         title: data.title || filename,
//         url: `/${slugPath}`,
//       });
//     }
//   }

//   return nodes;
// }


// export function getSidebarTree(): SidebarNode[] {
//   return buildSidebarTree(postsDirectory);
// }


// /**
//  * Resolves a full file path by slug array (e.g. ['folder', 'file'])
//  */
// export function findMarkdownFileBySlug(slugSegments: string[]): string | null {
//   function walk(dir: string, baseSegments: string[] = []): string | null {
//     const entries = fs.readdirSync(dir, { withFileTypes: true });

//     for (const entry of entries) {
//       const fullPath = path.join(dir, entry.name);

//       if (entry.isDirectory()) {
//         const nextBase = [...baseSegments, slugify(entry.name)];
//         const found = walk(fullPath, nextBase);
//         if (found) return found;
//       }

//       if (entry.isFile() && entry.name.endsWith(".md")) {
//         const filename = entry.name.replace(/\.md$/, "");
//         const currentSlug = [...baseSegments, slugify(filename)];

//         if (currentSlug.join("/") === slugSegments.join("/")) {
//           return fullPath;
//         }
//       }
//     }

//     return null;
//   }

//   return walk(postsDirectory);
// }


// /**
//  * Loads post content by slug segments
//  */
// export async function getPostData(slug: string[]) {
//   const filePath = findMarkdownFileBySlug(slug);
//   if (!filePath) throw new Error(`Post "${slug.join("/")}" not found`);

//   const fileContents = fs.readFileSync(filePath, "utf8");
//   const { data, content } = matter(fileContents);

//   const processedContent = await unified()
//     .use(remarkParse)
//     .use(remarkRehype)
//     .use(rehypeHighlight)
//     .use(rehypeStringify)
//     .process(content);

//   const contentHtml = processedContent.toString();

//   return {
//     title: data.title || slug.at(-1) || "Untitled",
//     contentHtml,
//   };
// }

// lib/posts.ts
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { listRepoFiles, getFileContent } from "./github";
import { slugify } from "@/lib/slugify";

type SidebarNode = {
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
};

function buildSidebarTree(files: { path: string }[]): SidebarNode[] {
  const tree: Record<string, InternalNode[]> = {};

  for (const file of files) {
    if (!file.path.endsWith(".md")) continue;
    const cleaned = file.path.replace(/^posts\//, "");
    const parts = cleaned.split("/");
    const filename = parts.pop()!;
    const folderPath = parts.map(slugify).join("/");

    tree[folderPath] ||= [];
    tree[folderPath].push({
      rawName: filename,
      fullPath: file.path,
      slugParts: parts.map(slugify),
    });
  }

  function buildNodes(base = ""): SidebarNode[] {
    const nodes: SidebarNode[] = [];

    const current = tree[base] || [];
    for (const file of current) {
      const name = file.rawName.replace(/\.md$/, "");
      const slug = slugify(name);
      const url = "/" + [...file.slugParts, slug].join("/");

      nodes.push({
        type: "file",
        name,
        title: name,
        url,
      });
    }

    const childKeys = Object.keys(tree)
      .filter(k => k.startsWith(base === "" ? "" : base + "/"))
      .map(k => {
        const parts = k.split("/");
        return parts[base === "" ? 0 : base.split("/").length];
      })
      .filter((v, i, a) => !!v && a.indexOf(v) === i);

    for (const child of childKeys) {
      const fullPath = base === "" ? child : `${base}/${child}`;
      nodes.push({
        type: "folder",
        name: child,
        children: buildNodes(fullPath),
      });
    }

    return nodes;
  }

  return buildNodes();
}

export async function getSidebarTree(): Promise<SidebarNode[]> {
  const files = await listRepoFiles(); // from GitHub repo
  return buildSidebarTree(files);
}

export async function getPostData(slug: string[]) {
  const filename = slug.map(slugify).join("/") + ".md";
  const path = `posts/${filename}`;
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
