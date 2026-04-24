"use client";

import { useState } from "react";
import { RichTextEditor } from "./richTextEditor";

export function EditorWrapper({ 
  name, 
  defaultValue = "" 
}: { 
  name: string; 
  defaultValue?: string 
}) {
  const [content, setContent] = useState(defaultValue);

  return (
    <>
      {/* Tiptap UI */}
      <RichTextEditor content={content} onChange={setContent} />
      
      {/* Hidden input agar terbaca oleh FormData di Server Action */}
      <input type="hidden" name={name} value={content} />
    </>
  );
}