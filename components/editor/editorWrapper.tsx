"use client";

import { useState } from "react";
import { RichTextEditor } from "./richTextEditor";

export function EditorWrapper({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [content, setContent] = useState(defaultValue);

  return (
    <>
      <RichTextEditor content={content} onChange={setContent} />

      <input type="hidden" name={name} value={content} />
    </>
  );
}
