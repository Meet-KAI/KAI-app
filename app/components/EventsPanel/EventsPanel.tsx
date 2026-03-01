"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { registeredEvents } from "../../data/mock-user";
import "./EventsPanel.css";

export default function EventsPanel() {
  return (
    <div className="events-panel">
      <div className="events-header">My Events</div>

      <div className="events-list">
        {registeredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-date">
              <CalendarDays size={14} />
              <span>{event.date}</span>
              <span className="event-time">{event.time}</span>
            </div>
            <div className="event-title">{event.title}</div>
            <div className="event-location">
              <MapPin size={12} />
              <span>{event.location}</span>
            </div>
            <div className="event-tags">
              {event.tags.map((tag) => (
                <span key={tag} className="event-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
