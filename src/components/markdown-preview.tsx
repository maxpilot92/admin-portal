"use client";

import { useEffect, useState } from "react";
import type { FC } from "react";

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  const [Component, setComponent] = useState<FC<{
    children: string;
    className?: string;
  }> | null>(null);

  useEffect(() => {
    import("react-markdown").then((mod) => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) {
    return <div className="animate-pulse bg-muted h-20 rounded-md" />;
  }

  return (
    <Component className="prose prose-sm max-w-none dark:prose-invert">
      {content}
    </Component>
  );
}
