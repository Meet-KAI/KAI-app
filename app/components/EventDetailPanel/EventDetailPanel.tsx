"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";
import { Event } from "../../types/events";
import { RegisterState } from "../../types/registration";
import { registerForEvent, unregisterFromEvent } from "../../actions/events";
import "./EventDetailPanel.css";

interface EventDetailPanelProps {
  event: Event | null;
  topic: string | null;
  topicEvents: Event[];
  registeredIds: Set<number>;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onTopicEventClick: (event: Event) => void;
  onBackToTopic?: () => void;
  onRegistrationChange: (eventId: number, registered: boolean) => void;
}

export default function EventDetailPanel({
  event,
  topic,
  topicEvents,
  registeredIds,
  onClose,
  onNext,
  onPrev,
  onTopicEventClick,
  onBackToTopic,
  onRegistrationChange,
}: EventDetailPanelProps) {
  
  const [registerState, setRegisterState] = useState<RegisterState>(RegisterState.Idle);
  const [registerMessage, setRegisterMessage] = useState("");
  const isRegistered = event ? registeredIds.has(event.id) : false;
  const isPastEvent = event ? new Date(event.date) < new Date() : false;

  useEffect(() => {
    setRegisterState(isRegistered ? RegisterState.Registered : RegisterState.Idle);
    setRegisterMessage("");
  }, [event?.id, isRegistered]);

  async function handleRegister() {
    if (!event) return;
    if (!isRegistered && isPastEvent) return;
    setRegisterState(RegisterState.Loading);
    setRegisterMessage("");

    if (isRegistered) {
      const result = await unregisterFromEvent(event.id);
      if (result.success) {
        onRegistrationChange(event.id, false);
        setRegisterState(RegisterState.Idle);
        setRegisterMessage(result.message);
      } else {
        setRegisterState(RegisterState.Registered);
        setRegisterMessage(result.message);
      }
    } else {
      const result = await registerForEvent(event.id);
      if (result.success) {
        onRegistrationChange(event.id, true);
        setRegisterState(RegisterState.Registered);
        setRegisterMessage(result.message);
      } else {
        setRegisterState(RegisterState.Error);
        setRegisterMessage(result.message);
      }
    }
  }
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
                <div className="event-detail-panel-list-title-row">
                  <span className="event-detail-panel-list-title">
                    {ev.title}
                  </span>
                  {registeredIds.has(ev.id) && (
                    <span className="event-detail-panel-registered-tag">Registered</span>
                  )}
                </div>
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
            {event.meetingUrl ? (
              <a
                href={event.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="event-detail-panel-location-link"
              >
                {event.location}
              </a>
            ) : (
              <span>{event.location}</span>
            )}
          </div>
          {isRegistered && (
            <span className="event-detail-panel-registered-tag">Registered</span>
          )}
        </div>

        <p className="event-detail-panel-description">{event.description}</p>

        <div className="event-detail-panel-capacity">
          <div className="event-detail-panel-capacity-header">
            <div className="event-detail-panel-capacity-label">
              <Users size={13} />
              <span>Capacity</span>
            </div>
            <span className="event-detail-panel-capacity-count">
              {event.attendees}/{event.maxCapacity}
            </span>
          </div>
          <div className="event-detail-panel-capacity-bar">
            <div
              className="event-detail-panel-capacity-fill"
              style={{ width: `${Math.min((event.attendees / event.maxCapacity) * 100, 100)}%` }}
            />
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

        <button
          className={`event-detail-panel-register ${!isRegistered && isPastEvent ? "past-event" : !isRegistered && event.attendees >= event.maxCapacity ? "at-capacity" : registerState}`}
          onClick={handleRegister}
          disabled={registerState === RegisterState.Loading || (!isRegistered && (isPastEvent || event.attendees >= event.maxCapacity))}
        >
          {!isRegistered && isPastEvent
            ? "Event Has Passed"
            : !isRegistered && event.attendees >= event.maxCapacity
            ? "Event at Capacity"
            : registerState === RegisterState.Loading
            ? "Loading..."
            : registerState === RegisterState.Registered
            ? "Unregister"
            : registerState === RegisterState.Error
            ? "Try Again"
            : "Register"}
        </button>
        {registerMessage && (
          <p className={`event-detail-panel-register-msg ${registerState}`}>
            {registerMessage}
          </p>
        )}
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
