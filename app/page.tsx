"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatPanel from "./components/ChatPanel/ChatPanel";
import EventsPanel from "./components/EventsPanel/EventsPanel";
import LearningPathsPanel from "./components/LearningPathsPanel/LearningPathsPanel";
import ProfilePanel from "./components/ProfilePanel/ProfilePanel";
import EventMap from "./components/EventMap/EventMap";
import { allEvents } from "./data/mock-events";

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("chat");

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

  return (
    <div className="dashboard">
      <Sidebar activeItem={activeNav} onNavigate={setActiveNav} />
      {renderPanel()}
      <EventMap events={allEvents} />
    </div>
  );
}
