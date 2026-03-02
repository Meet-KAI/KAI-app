"use client";

import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Event } from "../../types/events";
import { GraphNode } from "../../types/IGraphNode";
import { usePanZoom } from "../../hooks/usePanZoom";
import { useForceGraph } from "../../hooks/useForceGraph";
import { useMapInteractions } from "../../hooks/useMapInteractions";
import "./EventMap.css";

interface EventMapProps {
  events: Event[];
  selectedEvent: Event | null;
  selectedTopic: string | null;
  onSelectEvent: (event: Event | null) => void;
  onSelectTopic: (topic: string | null) => void;
}

export default function EventMap({ events, selectedEvent, selectedTopic, onSelectEvent, onSelectTopic }: EventMapProps) {
  const { pan, zoom, isPanning, containerRef, handlers } = usePanZoom();
  const { nodes, links, forceControls } = useForceGraph(events, containerRef);
  const { handleEventClick, handleTopicClick, handleBackgroundClick } =
    useMapInteractions(onSelectEvent, onSelectTopic, isPanning);

  const {
    showControls, setShowControls,
    linkDistance, setLinkDistance,
    chargeStrength, setChargeStrength,
    collideRadius, setCollideRadius,
  } = forceControls;

  return (
    <div
      ref={containerRef}
      className={`event-map ${isPanning.current ? "panning" : ""}`}
      onPointerDown={handlers.onPointerDown}
      onPointerMove={handlers.onPointerMove}
      onPointerUp={handlers.onPointerUp}
      onClick={handleBackgroundClick}
    >
      <div
        className="event-map-canvas"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* Edges (SVG layer underneath) */}
        <svg className="event-map-edges">
          {links.map((link, i) => {
            const source = link.source as GraphNode;
            const target = link.target as GraphNode;
            if (!source.x || !source.y || !target.x || !target.y) return null;
            const isHighlighted =
              selectedTopic &&
              (source.label === selectedTopic || target.label === selectedTopic);
            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className={`event-map-edge ${isHighlighted ? "highlighted" : ""}`}
              />
            );
          })}
        </svg>

        {/* Nodes (div layer on top) */}
        {nodes.map((node) => {
          if (node.type === "topic") {
            return (
              <button
                key={node.id}
                className={`event-map-topic-node ${
                  selectedTopic === node.label ? "selected" : ""
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.radius * 2,
                  height: node.radius * 2,
                }}
                onClick={(e) => handleTopicClick(e, node)}
              >
                <span className="event-map-topic-label">{node.label}</span>
              </button>
            );
          }

          return (
            <button
              key={node.id}
              className={`event-map-node ${
                selectedEvent?.id === node.event?.id ? "selected" : ""
              }`}
              style={{
                left: node.x,
                top: node.y,
                width: node.radius * 2,
                height: node.radius * 2,
              }}
              onClick={(e) => node.event && handleEventClick(e, node.event)}
            />
          );
        })}
      </div>

      {/* Force tuning controls */}
      <div
        className="event-map-controls"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="event-map-controls-toggle"
          onClick={() => setShowControls((v) => !v)}
        >
          <Settings size={14} />
          <span>Graph</span>
          {showControls ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        {showControls && (
          <div className="event-map-controls-body">
            <label className="event-map-control">
              <span className="event-map-control-label">
                Link Distance <strong>{linkDistance}</strong>
              </span>
              <input
                type="range"
                min={50}
                max={400}
                value={linkDistance}
                onChange={(e) => setLinkDistance(Number(e.target.value))}
              />
            </label>
            <label className="event-map-control">
              <span className="event-map-control-label">
                Repulsion <strong>{Math.abs(chargeStrength)}</strong>
              </span>
              <input
                type="range"
                min={10}
                max={500}
                value={Math.abs(chargeStrength)}
                onChange={(e) => setChargeStrength(-Number(e.target.value))}
              />
            </label>
            <label className="event-map-control">
              <span className="event-map-control-label">
                Collision Padding <strong>{collideRadius}</strong>
              </span>
              <input
                type="range"
                min={2}
                max={60}
                value={collideRadius}
                onChange={(e) => setCollideRadius(Number(e.target.value))}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
