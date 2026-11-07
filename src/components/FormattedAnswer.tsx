import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const components: Components = {
  h1: ({ children }) => <h2 className="font-display text-lg sm:text-xl font-bold text-foreground mt-5 mb-3 first:mt-0">{children}</h2>,
  h2: ({ children }) => <h3 className="font-display text-base sm:text-lg font-bold text-foreground mt-5 mb-2 pb-1 border-b first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="font-display text-base font-semibold text-primary mt-4 mb-2 first:mt-0">{children}</h4>,
  h4: ({ children }) => <h5 className="font-semibold text-foreground mt-3 mb-1.5">{children}</h5>,
  p: ({ children }) => <p className="leading-relaxed mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 marker:text-primary">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-2 marker:font-semibold marker:text-primary">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary bg-primary/5 rounded-r-lg px-4 py-2.5 my-3 [&>p]:mb-1">{children}</blockquote>
  ),
  hr: () => <hr className="my-4 border-border" />,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 break-words">{children}</a>
  ),
  pre: ({ children }) => (
    <pre className="bg-foreground/90 text-background rounded-lg p-3 my-3 overflow-x-auto text-xs sm:text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">{children}</pre>
  ),
  code: ({ children, className }) => (
    <code className={`${className ?? ""} font-mono text-[0.9em] bg-background/70 border rounded px-1.5 py-0.5 break-words`}>{children}</code>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-primary/10">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-2 text-left font-semibold border-b">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 border-b align-top">{children}</td>,
};

const FormattedAnswer = ({ content }: { content: string }) => (
  <div className="text-sm sm:text-[15px] text-foreground break-words [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1">
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
      {content}
    </ReactMarkdown>
  </div>
);

export default FormattedAnswer;
