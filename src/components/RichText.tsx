import { Fragment } from "react";
import { cn } from "@/lib/utils";

/** Splits "**bold**" segments into JSX with <strong>. */
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

interface RichTextProps {
  text: string;
  className?: string;
}

/** Paragraph-aware text renderer for content bodies. */
export function RichText({ text, className }: RichTextProps) {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <div className={cn("space-y-3 leading-7 text-muted-foreground", className)}>
      {paragraphs.map((para, i) => (
        <p key={i}>{renderInline(para, `p${i}`)}</p>
      ))}
    </div>
  );
}
