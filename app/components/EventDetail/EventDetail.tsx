import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "../../types/events";
import "./EventDetail.css";

export default function EventDetail({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) {
  return (
    <div className="event-detail" onClick={(e) => e.stopPropagation()}>
      <div className="event-detail-content">
        <h3 className="event-detail-title">{event.title}</h3>

        <div className="event-detail-meta">
          <div className="event-detail-meta-row">
            <Calendar size={14} />
            <span>
              {event.date} &middot; {event.time}
            </span>
          </div>
          <div className="event-detail-meta-row">
            <MapPin size={14} />
            <span>{event.location}</span>
          </div>
          <div className="event-detail-meta-row">
            <Users size={14} />
            <span>{event.attendees} attending</span>
          </div>
        </div>

        <div className="event-detail-tags">
          {event.tags.map((tag) => (
            <span key={tag} className="event-detail-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button className="event-detail-register">Register</button>
    </div>
  );
}
