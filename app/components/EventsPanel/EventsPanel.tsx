"use client";

import { useState, useEffect } from "react";
import { CalendarDays, MapPin, Plus, X } from "lucide-react";
import { Event } from "../../types/events";
import { fetchEventsByUser, createEvent } from "../../actions/events";
import "./EventsPanel.css";

interface EventsPanelProps {
  registeredIds: Set<number>;
  onSelectEvent: (event: Event) => void;
  onEventCreated?: () => void;
}

const EMPTY_FORM = {
  title: "",
  date: "",
  time: "",
  location: "",
  type: "webinar" as "webinar" | "in-person",
  maxCapacity: "",
  description: "",
  tags: "",
};

export default function EventsPanel({ registeredIds, onSelectEvent, onEventCreated }: EventsPanelProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEventsByUser()
      .then(setEvents)
      .catch((err) => {
        console.error("Failed to fetch user events:", err);
      })
      .finally(() => setLoading(false));
  }, [registeredIds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createEvent({
        title: form.title,
        date: form.date,
        time: form.time,
        location: form.location,
        type: form.type,
        maxCapacity: Number(form.maxCapacity) || 50,
        description: form.description,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      const updated = await fetchEventsByUser();
      setEvents(updated);
      onEventCreated?.();
    } catch (err) {
      console.error("Failed to create event:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  return (
    <div className="events-panel">
      <div className="events-header">
        <span>My Events</span>
        <button className="create-event-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Cancel" : "Create Event"}
        </button>
      </div>

      <div className="events-list">
        {showForm && (
          <form className="create-event-form" onSubmit={handleSubmit}>
            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>
            <div className="form-row">
              <label>
                Date
                <input name="date" type="date" value={form.date} onChange={handleChange} required />
              </label>
              <label>
                Time
                <input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 2:00 PM" required />
              </label>
            </div>
            <label>
              Location
              <input name="location" value={form.location} onChange={handleChange} required />
            </label>
            <div className="form-row">
              <label>
                Type
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="webinar">Webinar</option>
                  <option value="in-person">In-Person</option>
                </select>
              </label>
              <label>
                Max Capacity
                <input name="maxCapacity" type="number" min="1" value={form.maxCapacity} onChange={handleChange} placeholder="50" />
              </label>
            </div>
            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
            </label>
            <label>
              Tags
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="AI, Web Dev, Cloud" />
            </label>
            <div className="form-actions">
              <button type="button" className="form-cancel-btn" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="form-submit-btn" disabled={submitting}>
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        )}

        {loading && <p className="events-loading">Loading events...</p>}
        {!loading && events.length === 0 && !showForm && (
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
