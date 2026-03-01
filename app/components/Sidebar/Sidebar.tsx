"use client";

import { MessageSquare, CalendarDays, Library, Users } from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { icon: CalendarDays, label: "Events", id: "events" },
  { icon: MessageSquare, label: "Chat", id: "chat" },
  { icon: Library, label: "Knowledge", id: "knowledge" },
  { icon: Users, label: "Profile", id: "profile" },
];

export default function Sidebar({
  activeItem = "chat",
  onNavigate,
}: {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">KAI</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeItem === item.id ? "active" : ""}`}
            onClick={() => onNavigate?.(item.id)}
            title={item.label}
          >
            <item.icon size={22} strokeWidth={1.5} />
          </button>
        ))}
      </nav>
    </aside>
  );
}
