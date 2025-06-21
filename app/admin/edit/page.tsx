'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { readMarkdownFile, writeMarkdownFile } from '../actions';
import { MarkdownEditor } from '@/components/MarkdownEditor';

export default function EditMarkdownPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const file = searchParams.get('file');

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!file) return;
      const res = await readMarkdownFile(file);
      setContent(res);
      setLoading(false);
    }
    fetchData();
  }, [file]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    await writeMarkdownFile(file, content);
    router.push('/admin');
  }

  if (!file) return <p className="p-6 text-red-600">No file selected</p>;
  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Edit: {file}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <MarkdownEditor content={content} onChange={setContent} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
