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

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${siteConfig.name} — ${siteConfig.role}` },
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
          title="From student to systems thinker"
          description="A path shaped by curiosity, enterprise systems, infrastructure, and a growing focus on AI and cloud."
        />
        <JourneyTimeline />
      </section>

      <section id="skills" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="Capabilities"
          title="Skills, organized like a filesystem"
          description="No progress bars — just the categories I actually work in."
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
          eyebrow="Experience"
          title="Where I've been building"
        />
        <ExperienceTimeline />
      </section>

      <section id="journal" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="Journal"
          title="Writing"
          description="Reflections on networking, systems design, AI, and the career journey so far."
        />
        <JournalList />
      </section>

      <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something"
          description="Have a role, a project, or just want to talk systems? Send a message."
        />
        <ContactForm />
      </section>
    </>
  );
}
