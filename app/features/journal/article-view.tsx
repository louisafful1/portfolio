import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { ContentRenderer } from "~/features/content/content-renderer";
import type { JournalArticle } from "./journal-data";

export function ArticleView({ article }: { article: JournalArticle }) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-28">
      <Link
        to="/#journal"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to journal
      </Link>

      <header className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{article.date}</span>
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
          {article.title}
        </h1>
      </header>

      <ContentRenderer blocks={article.blocks} />
    </article>
  );
}
