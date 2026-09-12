import { Link } from "react-router";
import type { Route } from "./+types/journal-article";
import { getArticleBySlug } from "~/features/journal/journal-data";
import { ArticleView } from "~/features/journal/article-view";

export function meta({ params }: Route.MetaArgs) {
  const article = getArticleBySlug(params.slug);
  return [{ title: article ? `${article.title} - Louis Afful` : "Article not found" }];
}

export default function JournalArticleRoute({ params }: Route.ComponentProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-heading text-2xl font-semibold text-foreground">Article not found</p>
        <Link to="/#journal" className="mt-6 inline-block text-sm text-primary hover:underline">
          Back to journal
        </Link>
      </div>
    );
  }

  return <ArticleView article={article} />;
}
