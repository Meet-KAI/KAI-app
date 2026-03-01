"use client";

import Sidebar from "./components/Sidebar/Sidebar";
import ChatPanel from "./components/ChatPanel/ChatPanel";
import EventMap from "./components/EventMap/EventMap";
import { allEvents } from "./data/mock-events";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <ChatPanel />
      <EventMap events={allEvents} />
    </div>
  );
}
