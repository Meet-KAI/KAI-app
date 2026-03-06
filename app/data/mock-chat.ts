export interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export interface EventLink {
  title: string;
}

export type MessageSegment =
  | { type: "text"; value: string }
  | { type: "event"; title: string };

const EVENT_TOKEN = /\{\{EVENT:(.+?)\}\}/g;

export interface ParsedMessage {
  text: string;
  eventTitles: string[];
}

export function parseMessageContent(content: string): ParsedMessage {
  const eventTitles: string[] = [];
  const text = content.replace(EVENT_TOKEN, (_match, title) => {
    eventTitles.push(title);
    return title;
  });
  return { text, eventTitles };
}

const responses: Record<string, string> = {
  event:
    "I found several upcoming events that match your interests! Check out {{EVENT:React Server Components Deep Dive}} and {{EVENT:Building Production ML Pipelines}} — both align with your skill set. Want me to register you for either?",
  learn:
    "Based on your profile, I'd recommend starting with {{EVENT:Kubernetes Orchestration Patterns}} since you already have container experience. Then follow up with {{EVENT:Advanced TypeScript Patterns}} to level up your frontend skills. Shall I map out a full path?",
  recommend:
    "Given your background in React, TypeScript, and AWS, here are my top picks:\n\n1. {{EVENT:Serverless Architectures with AWS Lambda}} — builds on your cloud skills\n2. {{EVENT:Advanced TypeScript Patterns}} — take your TS to the next level\n3. {{EVENT:AI-Augmented Development Workflows}} — cutting-edge productivity\n\nWant details on any of these?",
  help:
    "I can help you with:\n- Finding events that match your interests\n- Building learning paths tailored to your goals\n- Connecting with peers who share your tech stack\n- Tracking progress across your registered events\n\nWhat would you like to explore?",
};

const fallbacks = [
  "That's a great question! Based on your profile as a Solution Architect, I'd suggest checking out {{EVENT:Cloud Native Architectures}} and {{EVENT:Terraform Infrastructure as Code}}. Both have openings this month.",
  "I can look into that for you. In the meantime, have you seen {{EVENT:Building Production ML Pipelines}}? It covers LLMs to production ML systems and fits your current skill set well.",
  "Interesting! Looking at the event map, I see some great options in your areas. {{EVENT:React Server Components Deep Dive}} and {{EVENT:GraphQL Federation at Scale}} are both getting a lot of buzz.",
  "I've noted that down. By the way, you're registered for several events. Would you like me to check for scheduling conflicts? You might also enjoy {{EVENT:AI-Augmented Development Workflows}}.",
];

let fallbackIndex = 0;

export function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes("event") || lower.includes("conference") || lower.includes("workshop")) {
    return responses.event;
  }
  if (lower.includes("learn") || lower.includes("path") || lower.includes("course")) {
    return responses.learn;
  }
  if (lower.includes("recommend") || lower.includes("suggest") || lower.includes("should i")) {
    return responses.recommend;
  }
  if (lower.includes("help") || lower.includes("what can") || lower.includes("how do")) {
    return responses.help;
  }

  const response = fallbacks[fallbackIndex % fallbacks.length];
  fallbackIndex++;
  return response;
}
