import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { journalArticles } from "./journal-data";

export function JournalList() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {journalArticles.map((article, index) => (
        <motion.div
          key={article.slug}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.35, delay: index * 0.04 }}
        >
          <Link
            to={`/journal/${article.slug}`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{article.date}</span>
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="font-heading text-base font-semibold text-foreground">{article.title}</p>
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
            </div>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
