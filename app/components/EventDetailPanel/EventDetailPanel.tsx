import {
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";
import { Event } from "../../data/mock-events";
import "./EventDetailPanel.css";

interface EventDetailPanelProps {
  event: Event | null;
  topic: string | null;
  topicEvents: Event[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTopicEventClick: (event: Event) => void;
  onBackToTopic?: () => void;
}

export default function EventDetailPanel({
  event,
  topic,
  topicEvents,
  onClose,
  onNext,
  onPrev,
  onTopicEventClick,
  onBackToTopic,
}: EventDetailPanelProps) {
  // Topic list view: topic is selected but no event drilled into
  if (topic && !event) {
    return (
      <div className="event-detail-panel">
        <div className="event-detail-panel-header">
          <h2 className="event-detail-panel-heading">{topic}</h2>
          <button className="event-detail-panel-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="event-detail-panel-body">
          <p className="event-detail-panel-count">
            {topicEvents.length} event{topicEvents.length !== 1 ? "s" : ""}
          </p>

          <div className="event-detail-panel-list">
            {topicEvents.map((ev) => (
              <button
                key={ev.id}
                className="event-detail-panel-list-item"
                onClick={() => onTopicEventClick(ev)}
              >
                <span className="event-detail-panel-list-title">
                  {ev.title}
                </span>
                <div className="event-detail-panel-list-meta">
                  <Calendar size={12} />
                  <span>{ev.date}</span>
                  <span>&middot;</span>
                  <span>{ev.type === "webinar" ? "Webinar" : "In-Person"}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Event detail view
  if (!event) return null;

  return (
    <div className="event-detail-panel">
      <div className="event-detail-panel-header">
        {onBackToTopic ? (
          <button
            className="event-detail-panel-back"
            onClick={onBackToTopic}
          >
            <ArrowLeft size={16} />
            <span>Back to {topic}</span>
          </button>
        ) : (
          <h2 className="event-detail-panel-heading">Event Details</h2>
        )}
        <button className="event-detail-panel-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="event-detail-panel-body">
        <h3 className="event-detail-panel-title">{event.title}</h3>

        <div className="event-detail-panel-meta">
          <div className="event-detail-panel-meta-row">
            <Calendar size={15} />
            <span>
              {event.date} &middot; {event.time}
            </span>
          </div>
          <div className="event-detail-panel-meta-row">
            <MapPin size={15} />
            <span>{event.location}</span>
          </div>
          <div className="event-detail-panel-meta-row">
            <Users size={15} />
            <span>{event.attendees} attending</span>
          </div>
        </div>

        <div className="event-detail-panel-type">
          <span className={`event-detail-panel-badge ${event.type}`}>
            {event.type === "webinar" ? "Webinar" : "In-Person"}
          </span>
        </div>

        <div className="event-detail-panel-tags">
          {event.tags.map((tag) => (
            <span key={tag} className="event-detail-panel-tag">
              {tag}
            </span>
          ))}
        </div>

        <button className="event-detail-panel-register">Register</button>
      </div>

      <div className="event-detail-panel-nav">
        <button className="event-detail-panel-nav-btn" onClick={onPrev}>
          <ChevronLeft size={16} />
          <span>Prev</span>
        </button>
        <button className="event-detail-panel-nav-btn" onClick={onNext}>
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
