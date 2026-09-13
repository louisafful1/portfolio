import type { ContentBlock } from "~/lib/content-blocks";

export interface JournalArticle {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  blocks: ContentBlock[];
}

export const journalArticles: JournalArticle[] = [
  {
    slug: "how-we-get-used-to-things",
    title: "How We Get Used to Things",
    date: "2026-09-08",
    tags: ["Reflection", "Problem Solving"],
    excerpt:
      "\"That's how we do it here\" is not an explanation. It's just a history.",
    blocks: [
      { type: "paragraph", text: "There is something strange about human beings." },
      { type: "paragraph", text: "We can get used to almost anything." },
      {
        type: "paragraph",
        text: "A broken chair stays in the same corner for three years because everyone knows which side is broken and has learned how to sit on the other side. A form takes twenty minutes to complete every morning, so people simply arrive ten minutes earlier. Someone keeps calling three different people to get information that could have been in one place, and eventually that becomes the normal way of getting information.",
      },
      { type: "paragraph", text: "Nobody wakes up and decides that this is a good system." },
      { type: "paragraph", text: "It just stays long enough." },
      {
        type: "paragraph",
        text: "I think that is how many bad systems survive. Not because nobody notices them, but because people eventually stop seeing them as problems.",
      },
      { type: "paragraph", text: "We say, \"That's how we do it here.\"" },
      { type: "paragraph", text: "That sentence is more powerful than it sounds." },
      { type: "paragraph", text: "It can kill curiosity." },
      {
        type: "paragraph",
        text: "Once something becomes familiar, we stop asking whether it still makes sense. We become experts at working around problems instead of solving them. We learn the weaknesses of a process so well that we begin to mistake our ability to cope with it for proof that the process works.",
      },
      { type: "heading", text: "Looking at ordinary things differently" },
      {
        type: "paragraph",
        text: "Maybe that is why I find myself looking at ordinary things differently now.",
      },
      {
        type: "paragraph",
        text: "When I see someone doing something repeatedly, I sometimes wonder why they have to do it that way. Not because the person is doing something wrong. Sometimes they are doing exactly what they were taught.",
      },
      {
        type: "paragraph",
        text: "The question is whether the process itself deserves to remain that way.",
      },
      { type: "paragraph", text: "And I have also learned that the answer isn't always software." },
      {
        type: "list",
        items: [
          "Sometimes the best solution is a better form.",
          "Sometimes it is moving something closer to where it is needed.",
          "Sometimes it is teaching someone properly.",
          "Sometimes the problem is simply that nobody has taken ownership of it.",
        ],
      },
      { type: "paragraph", text: "But sometimes, yes, it is software." },
      { type: "paragraph", text: "The interesting part is not the technology." },
      { type: "paragraph", text: "The interesting part is noticing." },
      {
        type: "paragraph",
        text: "I think good problem solving begins long before someone opens a code editor. It begins when you become uncomfortable with something everyone else has already accepted.",
      },
      { type: "paragraph", text: "Not every inconvenience needs to become a project." },
      { type: "paragraph", text: "But some of them deserve a second look." },
      {
        type: "paragraph",
        text: "Because \"we've always done it this way\" is not an explanation.",
      },
      { type: "paragraph", text: "It is just a history." },
    ],
  },
  {
    slug: "people-reveal-themselves-in-small-things",
    title: "I Think People Reveal Themselves in Small Things",
    date: "2026-09-12",
    tags: ["Reflection", "Character"],
    excerpt:
      "Big moments are too obvious. Character shows up in the small, unwatched ones.",
    blocks: [
      {
        type: "paragraph",
        text: "I don't think people reveal themselves in the big moments as much as we think they do.",
      },
      { type: "paragraph", text: "Big moments are too obvious." },
      {
        type: "paragraph",
        text: "When something important happens, everyone suddenly knows they are being watched. People become careful. They choose their words. They think about how they want to be remembered.",
      },
      { type: "heading", text: "The small moments are different." },
      {
        type: "list",
        items: [
          "How someone speaks to a person who cannot do anything for them.",
          "Whether they return something they borrowed.",
          "How they react when someone corrects them.",
          "Whether they listen when the conversation is no longer about them.",
          "What they do when they make a mistake.",
          "How they treat people when they are frustrated.",
        ],
      },
      {
        type: "paragraph",
        text: "These things seem insignificant until you start noticing patterns.",
      },
      { type: "paragraph", text: "I have become more interested in those patterns." },
      {
        type: "list",
        items: [
          "Someone can speak beautifully about respect and still be rude to people they consider less important.",
          "Someone can talk endlessly about teamwork but become defensive the moment someone points out a mistake.",
          "Someone can describe themselves as hardworking but disappear whenever there is no recognition attached to the work.",
        ],
      },
      {
        type: "paragraph",
        text: "And then there are people who barely talk about their character at all.",
      },
      { type: "paragraph", text: "They just behave consistently." },
      {
        type: "list",
        items: [
          "They say thank you.",
          "They keep their word.",
          "They listen.",
          "They help without making a performance out of it.",
          "They don't need to tell you they are humble.",
        ],
      },
      { type: "paragraph", text: "You can see it." },
      { type: "heading", text: "Why first impressions can be misleading" },
      {
        type: "paragraph",
        text: "We often judge people by how well they present themselves. But presentation is a skill. Character is what remains after the presentation becomes unnecessary.",
      },
      {
        type: "paragraph",
        text: "I don't think this means we should become suspicious of everyone or spend our lives analysing tiny behaviours. It just means I have learned to pay attention.",
      },
      {
        type: "paragraph",
        text: "Especially to how people behave when there is nothing to gain. Because when there is no reward, no audience, and no advantage, the decision becomes a little more honest.",
      },
      {
        type: "paragraph",
        text: "And sometimes a person's smallest decisions tell you what their biggest speeches never could.",
      },
    ],
  },
  {
    slug: "the-quiet-cost-of-becoming-dependable",
    title: "The Quiet Cost of Becoming the Person Everyone Can Depend On",
    date: "2026-09-10",
    tags: ["Reflection", "Responsibility"],
    excerpt:
      "Being dependable is a compliment - until it quietly becomes a job no one asked if you wanted.",
    blocks: [
      { type: "paragraph", text: "Being dependable sounds like a compliment." },
      { type: "paragraph", text: "It is." },
      {
        type: "paragraph",
        text: "But I don't think we talk enough about the cost that sometimes comes with it.",
      },
      {
        type: "paragraph",
        text: "When people discover that you can be counted on, they start counting on you.",
      },
      { type: "paragraph", text: "At first, you are proud of that." },
      {
        type: "paragraph",
        text: "Your phone rings and someone needs help. You answer. Someone has forgotten something. You remember. Something needs to be followed up. You do it.",
      },
      {
        type: "paragraph",
        text: "Eventually, people don't even ask whether you can handle it.",
      },
      { type: "paragraph", text: "They assume you will." },
      { type: "paragraph", text: "And there is something satisfying about being that person." },
      {
        type: "paragraph",
        text: "You know that if something falls into your hands, it probably won't disappear.",
      },
      { type: "heading", text: "The quiet danger of the identity" },
      {
        type: "paragraph",
        text: "But there is a quiet danger in becoming too comfortable with that identity.",
      },
      {
        type: "list",
        items: [
          "You can become so used to carrying things that you forget to ask whether they were yours to carry.",
          "You can become the person who says \"I'll handle it\" before thinking about what it will cost you.",
          "You can become reliable to everyone while slowly becoming unavailable to yourself.",
        ],
      },
      {
        type: "paragraph",
        text: "I think dependable people sometimes have difficulty disappointing others.",
      },
      {
        type: "list",
        items: [
          "So they say yes when they should say, \"I can't do this right now.\"",
          "They accept responsibilities they don't have the time for.",
          "They hide exhaustion because they don't want to become the person who suddenly cannot be relied upon.",
        ],
      },
      { type: "paragraph", text: "And eventually, reliability starts becoming resentment." },
      { type: "paragraph", text: "That is not what dependability is supposed to become." },
      { type: "heading", text: "Being honest about your capacity" },
      {
        type: "paragraph",
        text: "I am beginning to think that being dependable also means being honest about your capacity.",
      },
      { type: "paragraph", text: "If I tell you I will do something, I should mean it." },
      {
        type: "paragraph",
        text: "But if I cannot do it properly, telling you early is more responsible than quietly struggling until the deadline passes.",
      },
      {
        type: "paragraph",
        text: "There is nothing noble about making yourself permanently exhausted just so everyone else can remain comfortable.",
      },
      {
        type: "paragraph",
        text: "People who genuinely depend on you need the truth from you too.",
      },
      {
        type: "list",
        items: [
          "Sometimes that truth is, \"I need help.\"",
          "Sometimes it is, \"I won't be able to finish this today.\"",
          "Sometimes it is simply, \"This is not mine to handle.\"",
        ],
      },
      { type: "paragraph", text: "I still want to be someone people can depend on." },
      { type: "paragraph", text: "Very much." },
      {
        type: "paragraph",
        text: "But I don't think that should mean becoming the person who carries everything.",
      },
      {
        type: "paragraph",
        text: "Maybe real dependability is knowing what you can carry, carrying it well, and having enough honesty to put something down when you cannot.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return journalArticles.find((article) => article.slug === slug);
}
