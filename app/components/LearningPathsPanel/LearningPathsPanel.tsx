"use client";

import { BookOpen } from "lucide-react";
import { learningPaths } from "../../data/mock-user";
import { Event } from "../../types/events";
import "./LearningPathsPanel.css";

interface LearningPathsPanelProps {
  events: Event[];
}

export default function LearningPathsPanel({ events }: LearningPathsPanelProps) {
  return (
    <div className="paths-panel">
      <div className="paths-header">Learning Paths</div>

      <div className="paths-list">
        {learningPaths.map((path) => (
          <div key={path.id} className="path-card">
            <div className="path-title">
              <BookOpen size={16} />
              <span>{path.title}</span>
            </div>
            <div className="path-description">{path.description}</div>
            <div className="path-events">
              {path.eventIds.map((eventId, index) => {
                const event = events.find((e) => e.id === eventId);
                if (!event) return null;
                return (
                  <div key={event.id} className="path-event">
                    <span className="path-event-number">{index + 1}</span>
                    <span className="path-event-title">{event.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
