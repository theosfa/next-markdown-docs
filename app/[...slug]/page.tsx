"use server"

import { getPostData } from "@/lib/posts";
import { notFound } from "next/navigation";
import "github-markdown-css/github-markdown.css";
import { use } from "react";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const post = await getPostData(slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="flex justify-center px-4 py-8">
      <article className="markdown-body max-w-3xl w-full">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          {post.title}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </div>
  );
}
