"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { createAction } from "@/app/admin/actions";
import { Editor } from "@/components/Editor";
import { toast } from "sonner";

export function NewForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    await createAction(formData);

    toast.success("Post created successfully!");

    router.push("/admin");
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-row justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Create new Post</h1>
        <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Save
      </button>
        </div>
      <input
        type="text"
        name="title"
        placeholder="Post title"
        className="mb-4 p-2 border rounded"
        required
      />
      <div className="flex-1 min-h-0">
        <Editor initialValue="## Start writing..." />
      </div>
      
    </form>
  );
}
