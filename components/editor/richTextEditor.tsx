"use client";

import { useEditor, EditorContent,type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Undo, Redo 
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const activeClass = "data-[state=on]:bg-[#0f172a] data-[state=on]:text-white transition-colors";

  return (
    <div className="flex flex-wrap gap-1 border border-slate-200 bg-slate-50 p-1 rounded-t-md">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className={activeClass}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className={activeClass}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        className={activeClass}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-slate-300 mx-1 self-center" />
      
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={activeClass}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={activeClass}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      
      <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className={activeClass}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        className={activeClass}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        className={activeClass}
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <div className="w-px h-6 bg-slate-300 mx-1 self-center" />

      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[300px] w-full rounded-b-md border border-t-0 border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm sm:prose max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Mengirim format HTML ke parent
    },
  });

  return (
    <div className="flex flex-col w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}