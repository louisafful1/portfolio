import type { ContentBlock } from "~/lib/content-blocks";
import { cn } from "~/lib/utils";

export function ContentRenderer({ blocks, className }: { blocks: ContentBlock[]; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h3 key={index} className="font-heading text-lg font-semibold text-foreground pt-2">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={index} className="text-sm leading-relaxed text-muted-foreground">
                {block.text}
              </p>
            );
          case "list":
            return (
              <ul key={index} className="space-y-1.5">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <pre
                key={index}
                className="overflow-x-auto rounded-lg border border-border bg-surface px-4 py-3 font-mono text-xs leading-relaxed text-foreground"
              >
                <code>{block.code}</code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
