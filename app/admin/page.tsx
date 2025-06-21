// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { listMarkdownFiles } from './actions';
// import { slugify } from '@/lib/slugify'

// export default function AdminPage() {
//   const [files, setFiles] = useState<string[]>([]);

//   useEffect(() => {
//     async function fetchFiles() {
//       const result = await listMarkdownFiles();
//       setFiles(result);
//     }
//     fetchFiles();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Markdown Files</h1>
//         <Link
//           href="/admin/new"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           + New Page
//         </Link>
//       </div>

//       {files.length === 0 ? (
//         <p>No markdown files found.</p>
//       ) : (
//         <ul>
//       {files.map((file) => {
//         // 1) strip “.md”
//         // 2) split into segments
//         // 3) slugify each (lowercase, dashes instead of spaces)
//         const segments = file
//           .replace(/\.md$/, "")
//           .split("/")
//           .map((seg) => slugify(seg));

//         // join back into a path
//         const href = `/admin/edit/${segments.join("/")}`;

//         return (
//           <li key={file}>
//             <span>{file}</span>
//             <Link href={href} className="text-blue-600 hover:underline">
//               Edit
//             </Link>
//           </li>
//         );
//       })}
//     </ul>
//       )}
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listMarkdownFiles, deleteMarkdownFile } from './actions'; // import your server actions
import { slugify } from '@/lib/slugify';

export default function AdminPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFiles() {
      const result = await listMarkdownFiles();
      setFiles(result);
    }
    fetchFiles();
  }, []);

  async function handleDelete(file: string) {
    const confirmed = confirm(`Are you sure you want to delete "${file}"?`);
    if (!confirmed) return;

    setDeleting(file);
    try {
      await deleteMarkdownFile(file);
      setFiles((prev) => prev.filter((f) => f !== file));
      alert(`Deleted "${file}"`);
    } catch (error) {
      alert(`Failed to delete "${file}".`);
      console.error(error);
    } finally {
      setDeleting(null);
    }
  }

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
        <div className="border rounded">
          {/* Header Row */}
          <div className="flex bg-gray-100 font-semibold px-4 py-2">
            <div className="flex-1">File Path</div>
            <div className="w-24 text-center">Actions</div>
          </div>

          {/* Rows */}
          {files.map((file) => {
            const segments = file
              .replace(/\.md$/, '')
              .split('/')
              .map((seg) => slugify(seg));
            const href = `/admin/edit/${segments.join('/')}`;

            return (
              <div
                key={file}
                className="flex items-center border-t px-4 py-3 hover:bg-gray-50"
              >
                <div className="flex-1 truncate">{file}</div>
                <div className="w-24 flex justify-center gap-2">
                  <Link
                    href={href}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    disabled={deleting === file}
                    onClick={() => handleDelete(file)}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deleting === file ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
