import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React from 'react';

type MarkdownRendererProps = {
  children: string;
};

export function MarkdownRenderer({
  children: markdown
}: MarkdownRendererProps) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          const { children, className, node, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, '')}
              language={match[1]}
              style={oneDark}
              ref={React.createRef<SyntaxHighlighter>()}
            />
          ) : (
            <code
              {...rest}
              className={className}
              style={{
                backgroundColor: '#f5f5f5', // Slightly lighter gray, similar to GitHub's style
                fontFamily:
                  'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace', // Monospaced font stack
                fontSize: '90%', // Slightly smaller font size for a more compact look
                padding: '3px 6px', // Adjusted padding for better visual balance
                borderRadius: '6px', // Slightly larger border-radius for a smoother look
                border: '1px solid #d1d5da' // Subtle border similar to GitHub's style
              }}
            >
              {children}
            </code>
          );
        }
      }}
    >
      {markdown}
    </Markdown>
  );
}
