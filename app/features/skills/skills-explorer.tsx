import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { skillCategories } from "./skills-data";

export function SkillsExplorer() {
  return (
    <Accordion type="multiple" className="mx-auto w-full max-w-3xl" defaultValue={["frontend"]}>
      {skillCategories.map((category) => (
        <AccordionItem key={category.id} value={category.id} className="border-border">
          <AccordionTrigger className="py-4 hover:no-underline">
            <span className="flex items-center gap-3">
              <category.icon className="size-4 text-primary" />
              <span className="font-heading text-base font-medium text-foreground">
                {category.label}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pb-2 pl-7">
              {category.items.map((skill) => (
                <Badge key={skill} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
