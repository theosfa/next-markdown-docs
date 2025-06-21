'use client';

import { useEditor, EditorContent } from '@milkdown/react';
import { nord } from '@milkdown/theme-nord';
import { gfm } from '@milkdown/preset-gfm';
import { defaultValueCtx, editorViewOptionsCtx, milkdownInstanceCtx, rootCtx } from '@milkdown/core';
import type { FC } from 'react';

type Props = {
  content: string;
  onChange: (markdown: string) => void;
};

export const MarkdownEditor: FC<Props> = ({ content, onChange }) => {
  const { editor } = useEditor((root) =>
    root
      .config(nord)
      .config(gfm)
      .config(defaultValueCtx, content)
  , [content]);

  // Subscribe to content changes
  editor?.action((ctx) => {
    const view = ctx.get(editorViewOptionsCtx).editorView;
    view.dom.addEventListener('blur', () => {
      const md = ctx.get(milkdownInstanceCtx).action((ctx2) => {
        const doc = ctx2.get(editorViewOptionsCtx).editorView.state.doc.toString();
        return doc;
      });
      onChange(md);
    });
  });

  return <EditorContent />;
};
