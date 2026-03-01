"use client";

import { useState, useCallback, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatPanel from "./components/ChatPanel/ChatPanel";
import EventsPanel from "./components/EventsPanel/EventsPanel";
import LearningPathsPanel from "./components/LearningPathsPanel/LearningPathsPanel";
import ProfilePanel from "./components/ProfilePanel/ProfilePanel";
import EventMap from "./components/EventMap/EventMap";
import EventDetailPanel from "./components/EventDetailPanel/EventDetailPanel";
import { Event } from "./types/events";
import { fetchAllEvents, fetchEventsByUser, seedEvents } from "./actions/events";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("chat");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    seedEvents()
      .then(() => Promise.all([fetchAllEvents(), fetchEventsByUser()]))
      .then(([allEvts, userEvts]) => {
        setEvents(allEvts);
        setRegisteredIds(new Set(userEvts.map((e) => e.id)));
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
      });
  }, []);

  const handleRegistrationChange = useCallback((eventId: number, registered: boolean) => {
    setRegisteredIds((prev) => {
      const next = new Set(prev);
      if (registered) next.add(eventId);
      else next.delete(eventId);
      return next;
    });
    Promise.all([fetchAllEvents(), fetchEventsByUser()])
      .then(([allEvts, userEvts]) => {
        setEvents(allEvts);
        setRegisteredIds(new Set(userEvts.map((e) => e.id)));
        setSelectedEvent((prev) =>
          prev ? allEvts.find((e) => e.id === prev.id) ?? prev : prev
        );
      })
      .catch((err) => console.error("Failed to refetch events:", err));
  }, []);

  const topicEvents = selectedTopic
    ? events.filter((e) => e.tags.includes(selectedTopic))
    : [];

  const handleNext = useCallback(() => {
    if (!selectedEvent) return;
    // If viewing from a topic, navigate within that topic's events
    const pool = selectedTopic
      ? events.filter((e) => e.tags.includes(selectedTopic))
      : events;
    const idx = pool.findIndex((e) => e.id === selectedEvent.id);
    const next = pool[(idx + 1) % pool.length];
    setSelectedEvent(next);
  }, [selectedEvent, selectedTopic, events]);

  const handlePrev = useCallback(() => {
    if (!selectedEvent) return;
    const pool = selectedTopic
      ? events.filter((e) => e.tags.includes(selectedTopic))
      : events;
    const idx = pool.findIndex((e) => e.id === selectedEvent.id);
    const prev = pool[(idx - 1 + pool.length) % pool.length];
    setSelectedEvent(prev);
  }, [selectedEvent, selectedTopic, events]);

  const handleSelectEvent = useCallback((event: Event | null) => {
    setSelectedEvent(event);
    if (event) setSelectedTopic(null);
  }, []);

  const handleSelectTopic = useCallback((topic: string | null) => {
    setSelectedTopic(topic);
    setSelectedEvent(null);
  }, []);

  const handleTopicEventClick = useCallback((event: Event) => {
    setSelectedEvent(event);
    // keep selectedTopic so back button works
  }, []);

  const handleBackToTopic = useCallback(() => {
    setSelectedEvent(null);
    // selectedTopic remains set, so we return to topic list
  }, []);

  const handleClose = useCallback(() => {
    setSelectedEvent(null);
    setSelectedTopic(null);
  }, []);

  const renderPanel = () => {
    switch (activeNav) {
      case "chat":
        return <ChatPanel />;
      case "events":
        return <EventsPanel registeredIds={registeredIds} onSelectEvent={handleSelectEvent} />;
      case "knowledge":
        return <LearningPathsPanel events={events} />;
      case "profile":
        return <ProfilePanel />;
      default:
        return <ChatPanel />;
    }
  };

  const showPanel = selectedEvent || selectedTopic;

  return (
    <div className="dashboard">
      <Sidebar activeItem={activeNav} onNavigate={setActiveNav} />
      {renderPanel()}
      <EventMap
        events={events}
        selectedEvent={selectedEvent}
        selectedTopic={selectedTopic}
        onSelectEvent={handleSelectEvent}
        onSelectTopic={handleSelectTopic}
      />
      {showPanel && (
        <EventDetailPanel
          event={selectedEvent}
          topic={selectedTopic}
          topicEvents={topicEvents}
          registeredIds={registeredIds}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
          onTopicEventClick={handleTopicEventClick}
          onBackToTopic={selectedTopic && selectedEvent ? handleBackToTopic : undefined}
          onRegistrationChange={handleRegistrationChange}
        />
      )}
    </div>
  );
}
