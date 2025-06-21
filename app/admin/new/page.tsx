'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { writeMarkdownFile } from '../actions';
import { MarkdownEditor } from '@/components/MarkdownEditor';

export default function NewMarkdownPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filename = title.trim().toLowerCase().replace(/\s+/g, '-') + '.md';
    await writeMarkdownFile(filename, `---\ntitle: '${title}'\n---\n\n${content}`);
    router.push('/admin');
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Create Markdown Page</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <MarkdownEditor content={content} onChange={setContent} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
