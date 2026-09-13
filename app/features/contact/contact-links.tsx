import { Download, Mail } from "lucide-react";
import { LinkedinIcon, WhatsappIcon } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { siteConfig } from "~/lib/site-config";

export function ContactLinks() {
  return (
    <div className="mx-auto mb-10 max-w-xl text-center">
      <p className="mb-5 text-base font-medium text-foreground">
        I'm open to software engineering opportunities.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={`mailto:${siteConfig.email}`}>
            <Mail className="size-4" /> Email
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer">
            <LinkedinIcon className="size-4" /> LinkedIn
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={siteConfig.social.whatsapp} target="_blank" rel="noreferrer">
            <WhatsappIcon className="size-4" /> WhatsApp
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">
            <Download className="size-4" /> Résumé
          </a>
        </Button>
      </div>
    </div>
  );
}
