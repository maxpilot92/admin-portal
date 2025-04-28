// src/components/tiptap/Editor.tsx
"use client";

import React, { useState, useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Dropcursor from "@tiptap/extension-dropcursor";
import Heading, { Level } from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";
import HardBreak from "@tiptap/extension-hard-break";
import History from "@tiptap/extension-history";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CustomImage from "@/extensions/CustomImage";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sun,
  Moon,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code as CodeIcon,
  Code2,
  ArrowDown,
  Image as ImageIcon,
  Undo,
  Redo,
  Link as LinkIcon,
  Table as TableIcon,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import "./styles.scss";

// Default content for the editor
const DEFAULT_EDITOR_CONTENT = `
  <h1>Blog Title</h1>
  <p>Start writing your amazing post here…</p>
`;

// Extension configuration
const EDITOR_EXTENSIONS = [
  Document,
  Paragraph.configure({
    HTMLAttributes: {
      class: "blog-paragraph",
    },
  }),
  Text,
  CustomImage,
  Dropcursor,
  Heading.configure({
    levels: [1, 2, 3, 4],
    HTMLAttributes: {
      class: "blog-heading",
    },
  }),
  Bold,
  Italic,
  Underline,
  Strike,
  BulletList.configure({
    HTMLAttributes: {
      class: "blog-bullet-list",
    },
  }),
  OrderedList.configure({
    HTMLAttributes: {
      class: "blog-ordered-list",
    },
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: "blog-list-item",
    },
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: "blog-blockquote",
    },
  }),
  CodeBlock.configure({
    HTMLAttributes: {
      class: "blog-code-block",
    },
  }),
  Code.configure({
    HTMLAttributes: {
      class: "blog-inline-code",
    },
  }),
  HardBreak,
  History,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "blog-link",
    },
  }),
  Placeholder.configure({
    placeholder: "Write something inspiring...",
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "blog-table",
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  HorizontalRule,
];

interface EditorProps {
  setContent: (value: string) => void;
  initialContent?: string;
}

const Editor: React.FC<EditorProps> = ({ initialContent, setContent }) => {
  const [darkMode, setDarkMode] = useState(false);

  const editor = useEditor({
    extensions: EDITOR_EXTENSIONS,
    content: initialContent || DEFAULT_EDITOR_CONTENT,
    editorProps: {
      attributes: {
        class: "blog-editor-content outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      // Update content whenever the editor changes
      setContent(editor.getHTML());
    },
  });

  const addImage = useCallback(
    (direction: "left" | "right") => {
      if (!editor) return;

      const url = window.prompt("Enter image URL:");
      if (!url) return;

      const margin = direction === "left" ? "0 1rem 1rem 0" : "0 0 1rem 1rem";
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
          style: `float: ${direction}; margin: ${margin}; width: 300px;`,
          alt: "Blog image",
        })
        .run();
    },
    [editor]
  );

  const addLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) return;

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addTable = useCallback(() => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  const toggleHeading = useCallback(
    (level: Level) => {
      if (!editor) return;
      editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  const toggleDarkMode = useCallback((checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  }, []);

  // Prevent buttons from submitting the form
  const handleButtonClick = useCallback(
    (e: React.MouseEvent, callback: () => void) => {
      e.preventDefault();
      callback();
    },
    []
  );

  if (!editor) return null;

  return (
    <div className="space-y-4">
      {/* Main Toolbar */}
      <Card className="shadow-sm">
        <CardContent className="p-2">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {/* Heading levels */}
            <ToggleGroup type="single" className="space-x-1" defaultValue="">
              {[1, 2, 3, 4].map((level) => (
                <ToggleGroupItem
                  key={level}
                  value={`h${level}`}
                  aria-label={`Heading ${level}`}
                  className={`rounded ${
                    editor.isActive("heading", { level })
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleHeading(level as Level);
                  }}
                  type="button"
                >
                  H{level}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            {/* Text Formatting Controls */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={editor.isActive("bold") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleBold().run()
                  )
                }
                disabled={!editor.can().chain().focus().toggleBold().run()}
                title="Bold"
                type="button"
              >
                <BoldIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("italic") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleItalic().run()
                  )
                }
                title="Italic"
                type="button"
              >
                <ItalicIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("underline") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleUnderline().run()
                  )
                }
                title="Underline"
                type="button"
              >
                <UnderlineIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("strike") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleStrike().run()
                  )
                }
                title="Strikethrough"
                type="button"
              >
                <Strikethrough size={16} />
              </Button>
            </div>

            {/* Lists */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={editor.isActive("bulletList") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleBulletList().run()
                  )
                }
                title="Bullet List"
                type="button"
              >
                <List size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("orderedList") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleOrderedList().run()
                  )
                }
                title="Ordered List"
                type="button"
              >
                <ListOrdered size={16} />
              </Button>
            </div>

            {/* Quote, Code & Horizontal Rule */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={editor.isActive("blockquote") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleBlockquote().run()
                  )
                }
                title="Blockquote"
                type="button"
              >
                <Quote size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("codeBlock") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleCodeBlock().run()
                  )
                }
                title="Code Block"
                type="button"
              >
                <Code2 size={16} />
              </Button>
              <Button
                size="sm"
                variant={editor.isActive("code") ? "default" : "outline"}
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().toggleCode().run()
                  )
                }
                title="Inline Code"
                type="button"
              >
                <CodeIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().setHorizontalRule().run()
                  )
                }
                title="Horizontal Rule"
                type="button"
              >
                <Minus size={16} />
              </Button>
            </div>

            {/* Hard Break */}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) =>
                handleButtonClick(e, () =>
                  editor.chain().focus().setHardBreak().run()
                )
              }
              title="Line Break"
              type="button"
            >
              <ArrowDown size={16} />
            </Button>

            {/* Links & Special Features */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleButtonClick(e, () => addLink())}
                title="Add Link"
                type="button"
              >
                <LinkIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleButtonClick(e, () => addTable())}
                title="Insert Table"
                type="button"
              >
                <TableIcon size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleButtonClick(e, () => addImage("left"))}
                title="Image Left"
                type="button"
              >
                <ImageIcon size={16} className="mr-1" /> Left
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => handleButtonClick(e, () => addImage("right"))}
                title="Image Right"
                type="button"
              >
                <ImageIcon size={16} className="mr-1" /> Right
              </Button>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().setTextAlign("left").run()
                  )
                }
                title="Align Left"
                className={
                  editor.isActive({ textAlign: "left" })
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                type="button"
              >
                <AlignLeft size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().setTextAlign("center").run()
                  )
                }
                title="Align Center"
                className={
                  editor.isActive({ textAlign: "center" })
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                type="button"
              >
                <AlignCenter size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().setTextAlign("right").run()
                  )
                }
                title="Align Right"
                className={
                  editor.isActive({ textAlign: "right" })
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                type="button"
              >
                <AlignRight size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().setTextAlign("justify").run()
                  )
                }
                title="Justify"
                className={
                  editor.isActive({ textAlign: "justify" })
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                type="button"
              >
                <AlignJustify size={16} />
              </Button>
            </div>

            {/* History */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().undo().run()
                  )
                }
                disabled={!editor.can().chain().focus().undo().run()}
                title="Undo"
                type="button"
              >
                <Undo size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) =>
                  handleButtonClick(e, () =>
                    editor.chain().focus().redo().run()
                  )
                }
                disabled={!editor.can().chain().focus().redo().run()}
                title="Redo"
                type="button"
              >
                <Redo size={16} />
              </Button>
            </div>
          </div>

          {/* Dark/Light Toggle */}
          <div className="flex justify-end">
            <div className="flex items-center">
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                id="dark-mode-toggle"
                className="mr-2"
              />
              <label
                htmlFor="dark-mode-toggle"
                className="flex items-center cursor-pointer"
              >
                {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor Content */}
      <div className="prose max-w-none dark:prose-invert">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;
