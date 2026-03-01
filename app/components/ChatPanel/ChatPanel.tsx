"use client";

import { useState } from "react";
import { SendHorizonal, ChevronDown } from "lucide-react";
import "./ChatPanel.css";

export default function ChatPanel() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">Chat</div>

      <div className="chat-messages">
        {/* Messages will render here */}
      </div>

      <form className="chat-input-container" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          placeholder="Enter Text Here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={2}
        />
        <div className="chat-input-footer">
          <div className="chat-model-selector">
            <span className="chat-model-name">Claude Opus 4.6</span>
            <ChevronDown size={14} />
          </div>
          <button type="submit" className="chat-send-button">
            <SendHorizonal size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
