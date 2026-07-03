import type { JSONContent } from "@tiptap/react";

const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function emptyTipTapDoc(): JSONContent {
  return structuredClone(EMPTY_DOC);
}

/** Convert legacy plain-text posts (double-newline paragraphs) into a TipTap document. */
export function plainContentToTipTapDoc(content: string): JSONContent {
  const paragraphs = content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return emptyTipTapDoc();
  }

  return {
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: textToInlineNodes(text),
    })),
  };
}

/** Single newlines within a legacy paragraph become hard breaks. */
function textToInlineNodes(text: string): JSONContent[] {
  const lines = text.split("\n");
  const nodes: JSONContent[] = [];

  lines.forEach((line, index) => {
    if (line) {
      nodes.push({ type: "text", text: line });
    }
    if (index < lines.length - 1) {
      nodes.push({ type: "hardBreak" });
    }
  });

  return nodes.length > 0 ? nodes : [{ type: "text", text: "" }];
}

/** Extract plain text from TipTap JSON for the `content` fallback column and read-time. */
export function tiptapDocToPlainText(doc: JSONContent): string {
  if (!doc.content?.length) return "";

  return doc.content
    .map((block) => blockToPlainText(block))
    .filter(Boolean)
    .join("\n\n");
}

function blockToPlainText(node: JSONContent): string {
  switch (node.type) {
    case "pullQuote":
    case "blockquote":
      return (node.content ?? [])
        .map((child) => blockToPlainText(child))
        .filter(Boolean)
        .join("\n");
    case "bulletList":
    case "orderedList":
      return (node.content ?? [])
        .map((item) => blockToPlainText(item))
        .filter(Boolean)
        .join("\n");
    case "listItem":
      return inlineToPlainText(node);
    case "horizontalRule":
      return "";
    case "codeBlock":
      return (node.content ?? []).map((c) => c.text ?? "").join("");
    default:
      return inlineToPlainText(node);
  }
}

function inlineToPlainText(node: JSONContent): string {
  if (!node.content?.length) return "";

  return node.content
    .map((child) => {
      if (child.type === "text") return child.text ?? "";
      if (child.type === "hardBreak") return "\n";
      if (child.content) return inlineToPlainText(child);
      return "";
    })
    .join("");
}

export function postToEditorDoc(post: {
  content: string;
  content_format?: string | null;
  content_json?: JSONContent | null;
}): JSONContent {
  if (post.content_format === "tiptap" && post.content_json) {
    return post.content_json;
  }
  return plainContentToTipTapDoc(post.content);
}

export function estimateReadTimeFromText(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
