// app/admin/edit/[...slug]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { Editor } from "@/components/Editor";
import { updateAction } from "../../actions";
import { findMarkdownFileBySlug } from "@/lib/posts";

interface EditPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { slug } = await params;

  // 1. Locate the absolute file path based on slug segments
  const filePath = await findMarkdownFileBySlug(slug);
  if (!filePath) {
    throw new Error(`Post "${slug.join("/")}" not found`);
  }

  // 2. Read the raw markdown file
  const raw = fs.readFileSync(filePath, "utf8");

  // 3. Parse frontmatter to get title & markdown body
  const { data, content: markdownContent } = matter(raw);

  // 4. Compute the path **relative** to /posts, for your writeMarkdownFile
  const postsDir = path.join(process.cwd(), "posts");
  let relativePath = path.relative(postsDir, filePath);
  relativePath = relativePath.replace(/\\/g, "/"); // normalize slashes for Windows

  return (
    <main className="p-8 h-screen">
      <form action={updateAction} className="h-full flex flex-col">
        {/* pass the relative posts path, e.g. "testing/testmd.md" */}
        <div className="flex flex-row justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Edit Post</h1>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
        <input type="hidden" name="id" value={relativePath} />
        <input
          type="text"
          name="title"
          defaultValue={data.title ?? slug.at(-1)}
          className="mb-4 p-2 border rounded"
          required
        />

        <div className="flex-1">
          <Editor initialValue={markdownContent} />
        </div>
      </form>
    </main>
  );
}
