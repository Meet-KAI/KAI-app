"use client";

import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatPanel from "./components/ChatPanel/ChatPanel";
import EventsPanel from "./components/EventsPanel/EventsPanel";
import LearningPathsPanel from "./components/LearningPathsPanel/LearningPathsPanel";
import ProfilePanel from "./components/ProfilePanel/ProfilePanel";
import EventMap from "./components/EventMap/EventMap";
import EventDetailPanel from "./components/EventDetailPanel/EventDetailPanel";
import { allEvents, Event } from "./data/mock-events";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("chat");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topicEvents = selectedTopic
    ? allEvents.filter((e) => e.tags.includes(selectedTopic))
    : [];

  const handleNext = useCallback(() => {
    if (!selectedEvent) return;
    // If viewing from a topic, navigate within that topic's events
    const pool = selectedTopic
      ? allEvents.filter((e) => e.tags.includes(selectedTopic))
      : allEvents;
    const idx = pool.findIndex((e) => e.id === selectedEvent.id);
    const next = pool[(idx + 1) % pool.length];
    setSelectedEvent(next);
  }, [selectedEvent, selectedTopic]);

  const handlePrev = useCallback(() => {
    if (!selectedEvent) return;
    const pool = selectedTopic
      ? allEvents.filter((e) => e.tags.includes(selectedTopic))
      : allEvents;
    const idx = pool.findIndex((e) => e.id === selectedEvent.id);
    const prev = pool[(idx - 1 + pool.length) % pool.length];
    setSelectedEvent(prev);
  }, [selectedEvent, selectedTopic]);

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
        return <EventsPanel />;
      case "knowledge":
        return <LearningPathsPanel />;
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
        events={allEvents}
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
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
          onTopicEventClick={handleTopicEventClick}
          onBackToTopic={selectedTopic && selectedEvent ? handleBackToTopic : undefined}
        />
      )}
    </div>
  );
}
