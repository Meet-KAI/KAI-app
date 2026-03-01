"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceCollide,
  forceLink,
  Simulation,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from "d3-force";
import { Event, allTopics } from "../../data/mock-events";
import EventDetail from "../EventDetail/EventDetail";
import "./EventMap.css";

interface GraphNode extends SimulationNodeDatum {
  id: string;
  type: "event" | "topic";
  radius: number;
  label: string;
  event?: Event;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

export default function EventMap({ events }: { events: Event[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedScreenPos, setSelectedScreenPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Pan/zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  // Simulation + drag refs
  const simRef = useRef<Simulation<GraphNode, GraphLink> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const dragNode = useRef<GraphNode | null>(null);
  const dragMoved = useRef(false);

  // Run d3-force simulation on mount / when events change
  useEffect(() => {
    const container = containerRef.current;
    if (!container || events.length === 0) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Determine which topics are actually used
    const usedTopicLabels = new Set(events.flatMap((e) => e.tags));
    const topics = allTopics.filter((t) => usedTopicLabels.has(t.label));

    // Build nodes
    const topicNodes: GraphNode[] = topics.map((t) => ({
      id: `topic-${t.id}`,
      type: "topic" as const,
      radius: 14,
      label: t.label,
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200,
    }));

    const eventNodes: GraphNode[] = events.map((e) => ({
      id: `event-${e.id}`,
      type: "event" as const,
      radius: 6,
      label: e.title,
      event: e,
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200,
    }));

    const simNodes = [...topicNodes, ...eventNodes];

    // Build topic label → node id map
    const topicLabelToId = new Map(topics.map((t) => [t.label, `topic-${t.id}`]));

    // Build links: each event connects to each of its topics
    const simLinks: GraphLink[] = [];
    for (const e of events) {
      for (const tag of e.tags) {
        const topicId = topicLabelToId.get(tag);
        if (topicId) {
          simLinks.push({ source: `event-${e.id}`, target: topicId });
        }
      }
    }

    nodesRef.current = simNodes;
    linksRef.current = simLinks;

    const sim = forceSimulation(simNodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(simLinks)
          .id((d) => d.id)
          .distance(120)
      )
      .force("center", forceCenter(width / 2, height / 2))
      .force("charge", forceManyBody().strength(-60))
      .force(
        "collide",
        forceCollide<GraphNode>((d) => d.radius + 6).iterations(3)
      )
      .on("tick", () => {
        setNodes([...nodesRef.current]);
        setLinks([...linksRef.current]);
      });

    // Let it settle initially
    sim.alpha(1).restart();

    simRef.current = sim;

    return () => {
      sim.stop();
      simRef.current = null;
    };
  }, [events]);

  // --- Drag handlers on nodes ---
  const handleNodePointerDown = useCallback(
    (e: React.PointerEvent, node: GraphNode) => {
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      dragNode.current = node;
      dragMoved.current = false;
      node.fx = node.x;
      node.fy = node.y;

      // Reheat simulation
      simRef.current?.alphaTarget(0.3).restart();
    },
    []
  );

  const handleNodePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const node = dragNode.current;
      if (!node) return;

      dragMoved.current = true;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      // Convert screen coords to canvas coords (account for pan + zoom)
      node.fx = (e.clientX - rect.left - pan.x) / zoom;
      node.fy = (e.clientY - rect.top - pan.y) / zoom;
    },
    [pan, zoom]
  );

  const handleNodePointerUp = useCallback(() => {
    const node = dragNode.current;
    if (!node) return;

    node.fx = null;
    node.fy = null;
    dragNode.current = null;

    // Let simulation cool down
    simRef.current?.alphaTarget(0);
  }, []);

  // Pan handlers
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (
        (e.target as HTMLElement).closest(".event-map-node") ||
        (e.target as HTMLElement).closest(".event-map-topic-node")
      )
        return;
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
      panOrigin.current = { ...pan };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [pan]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragNode.current) return; // drag handled separately
      if (!isPanning.current) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPan({ x: panOrigin.current.x + dx, y: panOrigin.current.y + dy });
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  // Zoom handler — must use non-passive listener for preventDefault to work
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const next = prev - e.deltaY * 0.001;
        return Math.min(Math.max(next, 0.3), 3.0);
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const handleEventClick = useCallback(
    (e: React.MouseEvent, event: Event) => {
      e.stopPropagation();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setSelectedEvent(event);
      setSelectedScreenPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const handleBackgroundClick = useCallback(() => {
    if (!isPanning.current) {
      setSelectedEvent(null);
      setSelectedScreenPos(null);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`event-map ${isPanning.current ? "panning" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
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
            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className="event-map-edge"
              />
            );
          })}
        </svg>

        {/* Nodes (div layer on top) */}
        {nodes.map((node) => {
          if (node.type === "topic") {
            return (
              <div
                key={node.id}
                className={`event-map-topic-node ${
                  dragNode.current?.id === node.id ? "dragging" : ""
                }`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.radius * 2,
                  height: node.radius * 2,
                }}
                onPointerDown={(e) => handleNodePointerDown(e, node)}
                onPointerMove={handleNodePointerMove}
                onPointerUp={handleNodePointerUp}
              >
                <span className="event-map-topic-label">{node.label}</span>
              </div>
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

      {/* Detail card in screen-space (not affected by pan/zoom) */}
      {selectedEvent && selectedScreenPos && (
        <div
          className="event-map-detail-anchor"
          style={{
            left: Math.min(
              selectedScreenPos.x,
              containerRef.current
                ? containerRef.current.clientWidth - 320
                : selectedScreenPos.x
            ),
            top: Math.min(
              selectedScreenPos.y + 20,
              containerRef.current
                ? containerRef.current.clientHeight - 300
                : selectedScreenPos.y
            ),
          }}
        >
          <EventDetail
            event={selectedEvent}
            onClose={() => {
              setSelectedEvent(null);
              setSelectedScreenPos(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
