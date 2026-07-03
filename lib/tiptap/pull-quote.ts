import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pullQuote: {
      togglePullQuote: () => ReturnType;
    };
  }
}

export const PullQuote = Node.create({
  name: "pullQuote",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [{ tag: 'blockquote[data-pull-quote="true"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, {
        "data-pull-quote": "true",
        class: "pull-quote",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      togglePullQuote:
        () =>
        ({ commands }) =>
          commands.toggleWrap(this.name),
    };
  },
});
