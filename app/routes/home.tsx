import { useEffect } from "react";
import { useLocation } from "react-router";
import type { Route } from "./+types/home";
import { siteConfig } from "~/lib/site-config";
import { SectionHeading } from "~/components/section-heading";
import { HeroSection } from "~/features/hero/hero-section";
import { JourneyTimeline } from "~/features/about/journey-timeline";
import { SkillsExplorer } from "~/features/skills/skills-explorer";
import { ProjectGrid } from "~/features/projects/project-grid";
import { ExperienceTimeline } from "~/features/experience/experience-timeline";
import { JournalList } from "~/features/journal/journal-list";
import { ContactForm } from "~/features/contact/contact-form";
import { ContactLinks } from "~/features/contact/contact-links";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${siteConfig.name} - ${siteConfig.role}` },
    { name: "description", content: siteConfig.headline },
  ];
}

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [location.hash]);

  return (
    <>
      <HeroSection />

      <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="The Journey"
          title="Problem first, then software"
          description="A path shaped by real operational problems - from full-stack fundamentals to business software and AI-powered applications built for how work actually happens."
        />
        <JourneyTimeline />
      </section>

      <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="My Toolkit"
          title="The stack behind my work"
          description="The tools and technologies I work with."
        />
        <SkillsExplorer />
      </section>

      <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects"
          description="Each one documents the problem, the architecture, and what I'd do differently next time."
        />
        <ProjectGrid />
      </section>

      <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="Career"
          title="Professional Experience"
        />
        <ExperienceTimeline />
      </section>

      <section id="journal" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="Journal"
          title="Writing"
          description="Notes on software, automation, and the business problems behind the code."
        />
        <JournalList />
      </section>

      <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something"
          description="Have a role, a project, or just want to talk systems? Send a message."
        />
        <ContactLinks />
        <ContactForm />
      </section>
    </>
  );
}
