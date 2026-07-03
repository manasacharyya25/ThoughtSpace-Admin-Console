"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Strikethrough,
  TextQuote,
  Underline as UnderlineIcon,
} from "lucide-react";
import { PullQuote } from "@/lib/tiptap/pull-quote";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: JSONContent;
  onChange: (doc: JSONContent) => void;
  onPlainTextChange?: (text: string) => void;
  disabled?: boolean;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-md p-2 text-slate-600 transition hover:bg-slate-100 disabled:opacity-40",
        active && "bg-brand-50 text-brand-600"
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  onPlainTextChange,
  disabled,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      PullQuote,
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-brand-600 underline" },
      }),
      Placeholder.configure({
        placeholder: "Start writing your story…",
      }),
      CharacterCount,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose-editor max-w-none px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON();
      onChange(json);
      onPlainTextChange?.(ed.getText());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    const incoming = JSON.stringify(value);
    if (current !== incoming) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className="h-80 animate-pulse rounded-xl border border-slate-200 bg-slate-50" />
    );
  }

  function setLink() {
    const previous = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");

    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const words = editor.storage.characterCount.words();

  return (
    <div className="flex max-h-[min(70vh,640px)] min-h-[320px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Highlight"
          active={editor.isActive("highlight")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          disabled={disabled}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Block quote"
          active={editor.isActive("blockquote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Pull quote"
          active={editor.isActive("pullQuote")}
          disabled={disabled}
          onClick={() => editor.chain().focus().togglePullQuote().run()}
        >
          <TextQuote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          active={editor.isActive("codeBlock")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-slate-200" />

        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Divider"
          disabled={disabled}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Link"
          active={editor.isActive("link")}
          disabled={disabled}
          onClick={setLink}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
        <span>{words} words</span>
        <span>Rich text · saved as TipTap JSON</span>
      </div>
    </div>
  );
}
