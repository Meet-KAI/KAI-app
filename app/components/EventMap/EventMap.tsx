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
import { Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Event, allTopics } from "../../data/mock-events";
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

interface EventMapProps {
  events: Event[];
  selectedEvent: Event | null;
  selectedTopic: string | null;
  onSelectEvent: (event: Event | null) => void;
  onSelectTopic: (topic: string | null) => void;
}

export default function EventMap({ events, selectedEvent, selectedTopic, onSelectEvent, onSelectTopic }: EventMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);

  // Pan/zoom state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOrigin = useRef({ x: 0, y: 0 });

  // Force tuning controls
  const [showControls, setShowControls] = useState(false);
  const [linkDistance, setLinkDistance] = useState(200);
  const [chargeStrength, setChargeStrength] = useState(-150);
  const [collideRadius, setCollideRadius] = useState(20);

  // Simulation refs
  const simRef = useRef<Simulation<GraphNode, GraphLink> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);

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
          .distance(linkDistance)
      )
      .force("center", forceCenter(width / 2, height / 2))
      .force("charge", forceManyBody().strength(chargeStrength))
      .force(
        "collide",
        forceCollide<GraphNode>((d) => d.radius + collideRadius).iterations(3)
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
    // Only rebuild on events change — force params update via separate effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  // Live-update forces when sliders change
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;

    const linkForce = sim.force("link") as ReturnType<typeof forceLink<GraphNode, GraphLink>> | undefined;
    if (linkForce) linkForce.distance(linkDistance);

    const chargeForce = sim.force("charge") as ReturnType<typeof forceManyBody> | undefined;
    if (chargeForce) chargeForce.strength(chargeStrength);

    const collideForce = sim.force("collide") as ReturnType<typeof forceCollide<GraphNode>> | undefined;
    if (collideForce) collideForce.radius((d: GraphNode) => d.radius + collideRadius);

    sim.alpha(0.5).restart();
  }, [linkDistance, chargeStrength, collideRadius]);

  const handleTopicClick = useCallback(
    (e: React.MouseEvent, node: GraphNode) => {
      e.stopPropagation();
      onSelectTopic(node.label);
    },
    [onSelectTopic]
  );

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
      onSelectEvent(event);
    },
    [onSelectEvent]
  );

  const handleBackgroundClick = useCallback(() => {
    if (!isPanning.current) {
      onSelectEvent(null);
      onSelectTopic(null);
    }
  }, [onSelectEvent, onSelectTopic]);

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
