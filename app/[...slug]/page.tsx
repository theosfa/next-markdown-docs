'use server';

import { getPostData } from "@/lib/posts";
import { notFound } from "next/navigation";
import "github-markdown-css/github-markdown.css";

type Props = {
  params: { slug: string[] };
};

export default async function Page({ params }: Props) {
  const post = await getPostData(params.slug);

  return (
    <div className="flex justify-center px-4 py-8">
      <article className="markdown-body max-w-3xl w-full">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </div>
  );
}

