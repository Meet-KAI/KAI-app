"use client";

import { useState, useEffect } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { Event } from "../../types/events";
import { fetchEventsByUser } from "../../actions/events";
import "./EventsPanel.css";

interface EventsPanelProps {
  registeredIds: Set<number>;
  onSelectEvent: (event: Event) => void;
}

export default function EventsPanel({ registeredIds, onSelectEvent }: EventsPanelProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventsByUser()
      .then(setEvents)
      .catch((err) => {
        console.error("Failed to fetch user events:", err);
      })
      .finally(() => setLoading(false));
  }, [registeredIds]);

  return (
    <div className="events-panel">
      <div className="events-header">My Events</div>

      <div className="events-list">
        {loading && <p className="events-loading">Loading events...</p>}
        {!loading && events.length === 0 && (
          <p className="events-empty">No registered events yet.</p>
        )}
        {events.map((event) => (
          <div key={event.id} className="event-card" onClick={() => onSelectEvent(event)} style={{ cursor: "pointer" }}>
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
