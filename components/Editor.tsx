// components/Editor.tsx
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";


interface EditorProps {
  initialValue?: string;
}

export function Editor({ initialValue = "" }: EditorProps) {
  const [md, setMd] = useState(initialValue);

  useEffect(() => {
    const input = document.querySelector<HTMLInputElement>('input[name="content"]');
    if (input) input.value = md;
  }, [md]);

  return (
    <div className="grid grid-cols-2 gap-4 h-full w-full min-h-0 pb-10">
      <textarea
        name="content"
        className="p-4 border rounded resize-none w-full h-full min-h-0"
        value={md}
        onChange={(e) => setMd(e.target.value)}
      />
      <div className="p-4 border rounded overflow-auto markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
      </div>
    </div>
  );
}
