export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "webinar" | "in-person";
  attendees: number;
  tags: string[];
}

export interface Topic {
  id: string;
  label: string;
}

export const allTopics: Topic[] = [
  { id: "cloud", label: "Cloud" },
  { id: "kubernetes", label: "Kubernetes" },
  { id: "serverless", label: "Serverless" },
  { id: "frontend", label: "Frontend" },
  { id: "react", label: "React" },
  { id: "ai-ml", label: "AI/ML" },
  { id: "llms", label: "LLMs" },
  { id: "backend", label: "Backend" },
  { id: "go", label: "Go" },
  { id: "devops", label: "DevOps" },
  { id: "security", label: "Security" },
  { id: "databases", label: "Databases" },
  { id: "performance", label: "Performance" },
  { id: "rust", label: "Rust" },
];

export const allEvents: Event[] = [
  // Cloud & Infrastructure
  {
    id: 1,
    title: "AWS Lambda Best Practices",
    date: "Mar 22, 2026",
    time: "3:00 PM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 145,
    tags: ["Cloud", "Serverless", "Backend"],
  },
  {
    id: 2,
    title: "Terraform for Multi-Cloud",
    date: "Mar 25, 2026",
    time: "1:00 PM EST",
    location: "Google Meet",
    type: "webinar",
    attendees: 98,
    tags: ["Cloud", "DevOps"],
  },
  {
    id: 3,
    title: "Kubernetes in Production Workshop",
    date: "Mar 15, 2026",
    time: "10:00 AM EST",
    location: "Teams",
    type: "webinar",
    attendees: 312,
    tags: ["Cloud", "Kubernetes", "DevOps"],
  },
  {
    id: 4,
    title: "Docker Security Fundamentals",
    date: "Apr 1, 2026",
    time: "2:00 PM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 201,
    tags: ["Cloud", "Security", "Kubernetes"],
  },
  {
    id: 5,
    title: "Azure DevOps Pipeline Mastery",
    date: "Apr 3, 2026",
    time: "4:00 PM EST",
    location: "Teams",
    type: "webinar",
    attendees: 113,
    tags: ["Cloud", "DevOps"],
  },

  // Frontend
  {
    id: 10,
    title: "React Server Components Deep Dive",
    date: "Mar 8, 2026",
    time: "1:00 PM EST",
    location: "Google Meet",
    type: "webinar",
    attendees: 189,
    tags: ["Frontend", "React", "Performance"],
  },
  {
    id: 11,
    title: "Next.js 16 New Features Workshop",
    date: "Mar 24, 2026",
    time: "12:00 PM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 267,
    tags: ["Frontend", "React"],
  },
  {
    id: 12,
    title: "CSS Architecture at Scale",
    date: "Mar 27, 2026",
    time: "3:00 PM EST",
    location: "Google Meet",
    type: "webinar",
    attendees: 132,
    tags: ["Frontend", "Performance"],
  },
  {
    id: 13,
    title: "Web Performance Optimization",
    date: "Apr 2, 2026",
    time: "11:00 AM EST",
    location: "Teams",
    type: "webinar",
    attendees: 178,
    tags: ["Frontend", "Performance", "Backend"],
  },

  // AI & ML
  {
    id: 20,
    title: "LLM Fine-Tuning Workshop",
    date: "Mar 26, 2026",
    time: "10:00 AM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 345,
    tags: ["AI/ML", "LLMs"],
  },
  {
    id: 21,
    title: "RAG Architecture Patterns",
    date: "Mar 29, 2026",
    time: "2:00 PM EST",
    location: "Google Meet",
    type: "webinar",
    attendees: 278,
    tags: ["AI/ML", "LLMs", "Databases"],
  },
  {
    id: 22,
    title: "AI Agents & Tool Use",
    date: "Apr 7, 2026",
    time: "12:00 PM EST",
    location: "Pier 17, NYC",
    type: "in-person",
    attendees: 120,
    tags: ["AI/ML", "LLMs", "Backend"],
  },
  {
    id: 23,
    title: "Computer Vision with PyTorch",
    date: "Apr 1, 2026",
    time: "1:00 PM EST",
    location: "Teams",
    type: "webinar",
    attendees: 156,
    tags: ["AI/ML", "Performance"],
  },
  {
    id: 24,
    title: "MLOps & Model Deployment",
    date: "Apr 4, 2026",
    time: "3:00 PM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 198,
    tags: ["AI/ML", "DevOps", "Cloud"],
  },

  // Backend
  {
    id: 30,
    title: "Building Scalable Microservices with Go",
    date: "Mar 5, 2026",
    time: "2:00 PM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 234,
    tags: ["Backend", "Go", "Performance"],
  },
  {
    id: 31,
    title: "Rust for Backend Developers",
    date: "Mar 23, 2026",
    time: "1:00 PM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 167,
    tags: ["Backend", "Rust", "Performance"],
  },
  {
    id: 32,
    title: "PostgreSQL Performance Tuning",
    date: "Mar 26, 2026",
    time: "11:00 AM EST",
    location: "Google Meet",
    type: "webinar",
    attendees: 143,
    tags: ["Databases", "Performance", "Backend"],
  },
  {
    id: 33,
    title: "Event-Driven Architecture",
    date: "Apr 3, 2026",
    time: "2:00 PM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 210,
    tags: ["Backend", "Cloud", "Go"],
  },
  {
    id: 34,
    title: "gRPC & Protocol Buffers",
    date: "Mar 31, 2026",
    time: "3:00 PM EST",
    location: "Teams",
    type: "webinar",
    attendees: 87,
    tags: ["Backend", "Go", "Rust"],
  },

  // DevOps
  {
    id: 40,
    title: "DevOps NYC Meetup: CI/CD Pipelines",
    date: "Mar 12, 2026",
    time: "6:30 PM EST",
    location: "WeWork, Manhattan",
    type: "in-person",
    attendees: 75,
    tags: ["DevOps", "Cloud", "Security"],
  },
  {
    id: 41,
    title: "GitOps with ArgoCD",
    date: "Mar 18, 2026",
    time: "2:00 PM EST",
    location: "Zoom",
    type: "webinar",
    attendees: 134,
    tags: ["DevOps", "Kubernetes", "Cloud"],
  },
  {
    id: 42,
    title: "Observability & Monitoring",
    date: "Apr 5, 2026",
    time: "1:00 PM EST",
    location: "Google Meet",
    type: "webinar",
    attendees: 156,
    tags: ["DevOps", "Backend", "Performance"],
  },
];
