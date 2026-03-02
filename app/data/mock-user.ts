import { UserProfile, LearningPath } from "../types/user";

export type { UserProfile, LearningPath };

export const currentUser: UserProfile = {
  name: "Jason Hutchinson",
  email: "Jason.Hutchinson@example.com",
  title: "Solution Architect",
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
