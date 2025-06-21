// // import fs from "fs";
// // import path from "path";
// // import matter from "gray-matter";
// // import { remark } from "remark";
// // import html from "remark-html";

// // const postsDirectory = path.join(process.cwd(), 'posts');

// // // export function getSortedPostsData() {
// // //   const fileNames = fs.readdirSync(postsDirectory);
// // //   const allPostsData = fileNames.map((fileName) => {
// // //     const id = fileName.replace(/\.md$/, '');
// // //     const fullPath = path.join(postsDirectory, fileName);
// // //     const fileContents = fs.readFileSync(fullPath, 'utf8');
// // //     const matterResult = matter(fileContents);

// // //     return {
// // //       id,
// // //       ...(matterResult.data as { date: string; title: string }),
// // //     };
// // //   });

// // //   return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
// // // }

// // function walkMarkdownFiles(dir: string, base = ""): { title: string; url: string }[] {
// //   const entries = fs.readdirSync(dir, { withFileTypes: true });
// //   let posts: { title: string; url: string }[] = [];

// //   for (const entry of entries) {
// //     const fullPath = path.join(dir, entry.name);
// //     const relativePath = path.join(base, entry.name);

// //     if (entry.isDirectory()) {
// //       // Recurse into subdirectory
// //       posts = posts.concat(walkMarkdownFiles(fullPath, path.join(base, entry.name)));
// //     } else if (entry.isFile() && entry.name.endsWith(".md")) {
// //       const slug = relativePath.replace(/\.md$/, "").replace(/\\/g, "/"); // Ensure Unix-style URLs
// //       const fileContents = fs.readFileSync(fullPath, "utf8");
// //       const { data } = matter(fileContents);

// //       posts.push({
// //         title: data.title || slug,
// //         url: `/${slug}`,
// //       });
// //     }
// //   }

// //   return posts;
// // }

// // export function getSidebarPosts() {
// //   return walkMarkdownFiles(postsDirectory);
// // }

// // type SidebarNode = {
// //   type: "folder" | "file";
// //   name: string;              // folder or file name (without .md)
// //   url?: string;              // present only if type === 'file'
// //   title?: string;            // from frontmatter, only files
// //   children?: SidebarNode[];  // present only if folder
// // };

// // function buildSidebarTree(dir: string, base = ""): SidebarNode[] {
// //   const entries = fs.readdirSync(dir, { withFileTypes: true });
// //   let nodes: SidebarNode[] = [];

// //   for (const entry of entries) {
// //     const fullPath = path.join(dir, entry.name);
// //     const relativePath = path.join(base, entry.name);

// //     if (entry.isDirectory()) {
// //       nodes.push({
// //         type: "folder",
// //         name: entry.name,
// //         children: buildSidebarTree(fullPath, path.join(base, entry.name)),
// //       });
// //     } else if (entry.isFile() && entry.name.endsWith(".md")) {
// //       const slug = relativePath.replace(/\.md$/, "").replace(/\\/g, "/");
// //       const fileContents = fs.readFileSync(fullPath, "utf8");
// //       const { data } = matter(fileContents);

// //       nodes.push({
// //         type: "file",
// //         name: entry.name.replace(/\.md$/, ""),
// //         url: `/${slug}`,
// //         title: data.title || slug,
// //       });
// //     }
// //   }

// //   return nodes;
// // }

// // export function getSidebarTree() {
// //   return buildSidebarTree(postsDirectory);
// // }

// // export async function getPostData(slug: string) {
// //   const fullPath = path.join(postsDirectory, `${slug}.md`);
// //   if (!fs.existsSync(fullPath)) throw new Error("Post not found");

// //   const fileContents = fs.readFileSync(fullPath, "utf8");

// //   const { data, content } = matter(fileContents);
// //   const processedContent = await remark().use(html).process(content);
// //   const contentHtml = processedContent.toString();

// //   return {
// //     title: data.title || slug,
// //     contentHtml,
// //   };
// // }
// import fs from "fs";
// import path from "path";
// import matter from "gray-matter";
// import { remark } from "remark";
// import html from "remark-html";

// const postsDirectory = path.join(process.cwd(), "posts");

// type SidebarNode = {
//   type: "folder" | "file";
//   name: string;
//   url?: string;
//   title?: string;
//   children?: SidebarNode[];
// };

// // Recursively builds a tree for sidebar display, grouped by folders
// function buildSidebarTree(dir: string): SidebarNode[] {
//   const entries = fs.readdirSync(dir, { withFileTypes: true });

//   const topLevelFiles: SidebarNode[] = [];
//   const folders: SidebarNode[] = [];

//   for (const entry of entries) {
//     const fullPath = path.join(dir, entry.name);

//     if (entry.isDirectory()) {
//       folders.push({
//         type: "folder",
//         name: entry.name,
//         children: buildSidebarTree(fullPath),
//       });
//     } else if (entry.isFile() && entry.name.endsWith(".md")) {
//       const fileContents = fs.readFileSync(fullPath, "utf8");
//       const { data } = matter(fileContents);
//       const fileNameWithoutExt = entry.name.replace(/\.md$/, "");

//       topLevelFiles.push({
//         type: "file",
//         name: fileNameWithoutExt,
//         title: data.title || fileNameWithoutExt,
//         url: `/${fileNameWithoutExt}`,
//       });
//     }
//   }

//   return [...topLevelFiles, ...folders];
// }


// export function getSidebarTree(): SidebarNode[] {
//   return buildSidebarTree(postsDirectory);
// }

// // Recursively finds a .md file by filename (flat)
// // function findMarkdownFileByName(name: string, dir: string): string | null {
// //   const entries = fs.readdirSync(dir, { withFileTypes: true });

// //   for (const entry of entries) {
// //     const fullPath = path.join(dir, entry.name);

// //     if (entry.isDirectory()) {
// //       const found = findMarkdownFileByName(name, fullPath);
// //       if (found) return found;
// //     }

// //     if (entry.isFile() && entry.name === `${name}.md`) {
// //       return fullPath;
// //     }
// //   }

// //   return null;
// // }
// function findMarkdownFileByName(slugPath: string, dir: string): string | null {
//   const fullPath = path.join(postsDirectory, `${slugPath}.md`);
//   return fs.existsSync(fullPath) ? fullPath : null;
// }

// export async function getPostData(slug: string[]) {
//   const joinedSlug = slug.join("/");
//   const filePath = findMarkdownFileByName(joinedSlug, postsDirectory);
//   if (!filePath) throw new Error(`Post "${joinedSlug}" not found`);

//   const fileContents = fs.readFileSync(filePath, "utf8");
//   const { data, content } = matter(fileContents);

//   const processedContent = await remark().use(html).process(content);
//   const contentHtml = processedContent.toString();

//   return {
//     title: data.title || joinedSlug,
//     contentHtml,
//   };
// }

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkHtml from "remark-html";
import rehypeHighlight from "rehype-highlight";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import 'highlight.js/styles/github.css'; // ← this imports GitHub style



const postsDirectory = path.join(process.cwd(), "posts");

type SidebarNode = {
  type: "folder" | "file";
  name: string;
  url?: string;
  title?: string;
  children?: SidebarNode[];
};

/**
 * Recursively builds the sidebar tree with full folder structure
 */
function buildSidebarTree(dir: string, base = ""): SidebarNode[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const nodes: SidebarNode[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const isDir = entry.isDirectory();
    const isMarkdown = entry.isFile() && entry.name.endsWith(".md");

    if (isDir) {
      const slug = slugify(entry.name);
      const subTree = buildSidebarTree(fullPath, path.join(base, slug));
      nodes.push({
        type: "folder",
        name: entry.name,
        children: subTree,
      });
    }

    if (isMarkdown) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      const filename = entry.name.replace(/\.md$/, "");
      const slugSegment = slugify(filename);
      const slugPath = path.join(base, slugSegment).replace(/\\/g, "/");

      nodes.push({
        type: "file",
        name: filename,
        title: data.title || filename,
        url: `/${slugPath}`,
      });
    }
  }

  return nodes;
}


export function getSidebarTree(): SidebarNode[] {
  return buildSidebarTree(postsDirectory);
}

function slugify(str: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
    щ: "shch", ы: "y", э: "e", ю: "yu", я: "ya", ъ: "", ь: ""
  };

  return str
    .toLowerCase()
    .replace(/[а-яё]/gi, (char) => map[char] || "") // transliterate Russian
    .replace(/\s+/g, "-")       // replace spaces with -
    .replace(/[^\w\-]+/g, "")   // remove non-word characters
    .replace(/\-\-+/g, "-")     // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");   // trim hyphens
}
/**
 * Resolves a full file path by slug array (e.g. ['folder', 'file'])
 */
function findMarkdownFileBySlug(slugSegments: string[]): string | null {
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
export async function getPostData(slug: string[]) {
  const filePath = findMarkdownFileBySlug(slug);
  if (!filePath) throw new Error(`Post "${slug.join("/")}" not found`);

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    title: data.title || slug.at(-1) || "Untitled",
    contentHtml,
  };
}

