export interface TerminalDemoStep {
  question: string;
  answer: string;
}

// Short, accurate scripted exchanges for the decorative hero demo - not live
// calls to the real assistant, just a preview of how it behaves.
export const TERMINAL_DEMO_SCRIPT: TerminalDemoStep[] = [
  {
    question: "What did Louis build at Adamus?",
    answer:
      "He built internal systems for vehicle/equipment inspections and attendance, and supports IT operations including networking and infrastructure.",
  },
  {
    question: "What problem did the attendance system solve?",
    answer:
      "Manual sign-offs were unreliable and hard to audit across departments, so he built a geofenced, photo-verified check-in system instead.",
  },
];
