'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listMarkdownFiles } from './actions';

export default function AdminPage() {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      const result = await listMarkdownFiles();
      setFiles(result);
    }
    fetchFiles();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Markdown Files</h1>
        <Link
          href="/admin/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Page
        </Link>
      </div>

      {files.length === 0 ? (
        <p>No markdown files found.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file} className="border p-3 rounded flex justify-between items-center">
              <span>{file}</span>
              <Link
                href={`/admin/edit?file=${encodeURIComponent(file)}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}