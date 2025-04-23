// src/extensions/CustomImage.ts
import { mergeAttributes, Node } from "@tiptap/core";

export interface CustomImageOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        style?: string;
      }) => ReturnType;
    };
    // Add textAlign command type
    textAlign: {
      setTextAlign: (
        alignment: "left" | "center" | "right" | "justify"
      ) => ReturnType;
      unsetTextAlign: () => ReturnType;
    };
  }
}

const CustomImage = Node.create<CustomImageOptions>({
  name: "customImage",
  group: "block",
  inline: false,
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      style: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addCommands() {
    return {
      setImage:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          });
        },
    };
  },
});

export default CustomImage;
