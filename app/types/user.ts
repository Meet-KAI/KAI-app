export interface UserProfile {
  name: string;
  email: string;
  title: string;
  skills: string[];
  registeredEventIds: number[];
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  eventIds: number[];
}
