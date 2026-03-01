"use client";

import { useState, useMemo } from "react";
import { Event } from "../../data/mock-events";
import EventDetail from "../EventDetail/EventDetail";
import "./EventMap.css";

interface BubbleCluster {
  tag: string;
  events: Event[];
  cx: number;
  cy: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateBubblePositions(
  events: Event[],
  clusterCx: number,
  clusterCy: number,
  seed: number
) {
  const positions: { x: number; y: number; size: number; event: Event }[] = [];

  events.forEach((event, i) => {
    const angle = (i / events.length) * Math.PI * 2 + seededRandom(seed + i) * 0.8;
    const radius = 40 + seededRandom(seed + i + 100) * 80;
    const size = 20 + seededRandom(seed + i + 200) * 24;

    positions.push({
      x: clusterCx + Math.cos(angle) * radius,
      y: clusterCy + Math.sin(angle) * radius,
      size,
      event,
    });
  });

  return positions;
}

export default function EventMap({ events }: { events: Event[] }) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedPos, setSelectedPos] = useState<{ x: number; y: number } | null>(null);

  const clusters = useMemo(() => {
    const tagMap = new Map<string, Event[]>();
    events.forEach((event) => {
      const tag = event.tags[0] || "Other";
      if (!tagMap.has(tag)) tagMap.set(tag, []);
      tagMap.get(tag)!.push(event);
    });

    const clusterPositions = [
      { cx: 25, cy: 30 },
      { cx: 72, cy: 20 },
      { cx: 55, cy: 60 },
      { cx: 20, cy: 65 },
      { cx: 78, cy: 55 },
      { cx: 40, cy: 15 },
      { cx: 60, cy: 40 },
      { cx: 85, cy: 35 },
    ];

    const result: BubbleCluster[] = [];
    let idx = 0;
    tagMap.forEach((tagEvents, tag) => {
      const pos = clusterPositions[idx % clusterPositions.length];
      result.push({ tag, events: tagEvents, cx: pos.cx, cy: pos.cy });
      idx++;
    });

    return result;
  }, [events]);

  const allBubbles = useMemo(() => {
    return clusters.flatMap((cluster, ci) =>
      generateBubblePositions(cluster.events, cluster.cx, cluster.cy, ci * 50).map(
        (bubble) => ({
          ...bubble,
          tag: cluster.tag,
        })
      )
    );
  }, [clusters]);

  return (
    <div
      className="event-map"
      onClick={() => {
        setSelectedEvent(null);
        setSelectedPos(null);
      }}
    >
      {/* Tag labels */}
      {clusters.map((cluster) => (
        <div
          key={cluster.tag}
          className="event-map-tag-label"
          style={{ left: `${cluster.cx}%`, top: `${cluster.cy - 12}%` }}
        >
          {cluster.tag}
        </div>
      ))}

      {/* Bubbles */}
      {allBubbles.map((bubble, i) => (
        <button
          key={i}
          className={`event-map-bubble ${
            selectedEvent?.id === bubble.event.id ? "selected" : ""
          }`}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: bubble.size,
            height: bubble.size,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEvent(bubble.event);
            setSelectedPos({ x: bubble.x, y: bubble.y });
          }}
        />
      ))}

      {/* Selected event detail card */}
      {selectedEvent && selectedPos && (
        <div
          style={{
            left: `${Math.min(selectedPos.x, 70)}%`,
            top: `${Math.min(selectedPos.y + 5, 55)}%`,
          }}
          className="event-map-detail-anchor"
        >
          <EventDetail
            event={selectedEvent}
            onClose={() => {
              setSelectedEvent(null);
              setSelectedPos(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
