"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizonal, ChevronDown } from "lucide-react";
import { Compass } from "lucide-react";
import { ChatMessage, getMockResponse, parseMessageContent } from "../../data/mock-chat";
import { Event } from "../../types/events";
import "./ChatPanel.css";

interface ChatPanelProps {
  events: Event[];
  onSelectEvent: (event: Event | null) => void;
}

export default function ChatPanel({ events, onSelectEvent }: ChatPanelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const renderAssistantMessage = (content: string) => {
    const { text, eventTitles } = parseMessageContent(content);
    const matchedEvents = eventTitles
      .map((title) => events.find((e) => e.title.toLowerCase() === title.toLowerCase()))
      .filter((e): e is Event => e !== undefined);

    return (
      <>
        <p>{text}</p>
        {matchedEvents.length > 0 && (
          <div className="chat-event-buttons">
            {matchedEvents.map((evt) => (
              <button
                key={evt.id}
                className="chat-event-button"
                onClick={() => onSelectEvent(evt)}
              >
                <Compass size={13} />
                <span>{evt.title}</span>
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: message.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userText = message.trim();
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getMockResponse(userText);
      const assistantMsg: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">Chat</div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p className="chat-empty-title">KAI Assistant</p>
            <p className="chat-empty-subtitle">
              Ask about events, learning paths, or recommendations.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble chat-bubble-${msg.role}`}>
            {msg.role === "assistant" && (
              <span className="chat-bubble-label">KAI</span>
            )}
            {msg.role === "assistant" ? renderAssistantMessage(msg.content) : <p>{msg.content}</p>}
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble chat-bubble-assistant">
            <span className="chat-bubble-label">KAI</span>
            <div className="chat-typing">
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
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
          <button type="submit" className="chat-send-button" disabled={isTyping}>
            <SendHorizonal size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
