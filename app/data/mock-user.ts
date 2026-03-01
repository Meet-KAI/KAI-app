import { allEvents } from "./mock-events";

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  skills: string[];
  registeredEventIds: number[];
}

export const currentUser: UserProfile = {
  name: "Alex Chen",
  email: "alex.chen@example.com",
  title: "Senior Software Engineer",
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "Python",
    "GraphQL",
    "PostgreSQL",
    "Terraform",
  ],
  registeredEventIds: [1, 3, 11, 20, 22, 31],
};

export const registeredEvents = allEvents.filter((e) =>
  currentUser.registeredEventIds.includes(e.id)
);

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  eventIds: number[];
}

export const learningPaths: LearningPath[] = [
  {
    id: 1,
    title: "Cloud Native Foundations",
    description: "Master containerization and cloud infrastructure",
    eventIds: [3, 4, 1, 5],
  },
  {
    id: 2,
    title: "AI/ML Engineering",
    description: "From LLMs to production ML systems",
    eventIds: [20, 21, 22, 24],
  },
  {
    id: 3,
    title: "Modern Frontend",
    description: "Build performant React applications at scale",
    eventIds: [10, 11, 12, 13],
  },
];
