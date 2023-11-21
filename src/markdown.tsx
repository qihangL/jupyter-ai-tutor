
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type MarkdownRendererProps = {
  children: string;
};

/**
 * Renders Markdown content, including syntax highlighting for code.
 *
 * @param {MarkdownRendererProps} props - Component properties.
 * @returns {JSX.Element} The rendered Markdown content.
 */
export function MarkdownRenderer({ children: markdown }: MarkdownRendererProps): JSX.Element {
  const renderCodeBlock = (props: any) => {
    const { node, inline, className, children, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        {...rest}
      >
        {String(children).replace(/$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  };

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: renderCodeBlock
      }}
    >
      {markdown}
    </Markdown>
  );
}
