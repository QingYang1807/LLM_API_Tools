import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const CodeBlock: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  return (
    <SyntaxHighlighter
      style={oneDark}
      language={language}
      PreTag="div"
      className="rounded-lg !mt-4 !mb-4"
      customStyle={{
        margin: 0,
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        lineHeight: '1.5',
      }}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};

const InlineCode: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm font-mono">
    {children}
  </code>
);

const Link: React.FC<any> = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 dark:text-blue-400 hover:underline"
  >
    {children}
  </a>
);

const Table: React.FC<any> = ({ children }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg">
      {children}
    </table>
  </div>
);

const Th: React.FC<any> = ({ children }) => (
  <th className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-left font-medium">
    {children}
  </th>
);

const Td: React.FC<any> = ({ children }) => (
  <td className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
    {children}
  </td>
);

const Blockquote: React.FC<any> = ({ children }) => (
  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
    {children}
  </blockquote>
);

const H1: React.FC<any> = ({ children }) => (
  <h1 className="text-2xl font-bold mt-6 mb-4 text-slate-900 dark:text-slate-100">
    {children}
  </h1>
);

const H2: React.FC<any> = ({ children }) => (
  <h2 className="text-xl font-semibold mt-5 mb-3 text-slate-900 dark:text-slate-100">
    {children}
  </h2>
);

const H3: React.FC<any> = ({ children }) => (
  <h3 className="text-lg font-medium mt-4 mb-2 text-slate-900 dark:text-slate-100">
    {children}
  </h3>
);

const Ul: React.FC<any> = ({ children }) => (
  <ul className="list-disc list-inside my-4 space-y-1">
    {children}
  </ul>
);

const Ol: React.FC<any> = ({ children }) => (
  <ol className="list-decimal list-inside my-4 space-y-1">
    {children}
  </ol>
);

const Li: React.FC<any> = ({ children }) => (
  <li className="text-slate-700 dark:text-slate-300">
    {children}
  </li>
);

const P: React.FC<any> = ({ children }) => (
  <p className="my-3 text-slate-700 dark:text-slate-300 leading-relaxed">
    {children}
  </p>
);

const Strong: React.FC<any> = ({ children }) => (
  <strong className="font-semibold text-slate-900 dark:text-slate-100">
    {children}
  </strong>
);

const Em: React.FC<any> = ({ children }) => (
  <em className="italic text-slate-700 dark:text-slate-300">
    {children}
  </em>
);

const Hr: React.FC<any> = () => (
  <hr className="my-6 border-slate-200 dark:border-slate-700" />
);

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return <InlineCode {...props}>{children}</InlineCode>;
            }
            return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
          },
          a: Link,
          table: Table,
          th: Th,
          td: Td,
          blockquote: Blockquote,
          h1: H1,
          h2: H2,
          h3: H3,
          ul: Ul,
          ol: Ol,
          li: Li,
          p: P,
          strong: Strong,
          em: Em,
          hr: Hr,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}; 