// @ts-check
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Instructions({ instructions }) {
  return (
    <div className="prose prose-bluegray max-w-prose rounded-lg bg-gray-50 px-6 py-2 shadow-sm ring-1 ring-gray-900/5">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{instructions}</ReactMarkdown>
    </div>
  );
}
