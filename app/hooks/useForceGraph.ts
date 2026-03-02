import { useState, useEffect, useRef, RefObject } from "react";
import {
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceCollide,
  forceLink,
  Simulation,
} from "d3-force";
import { Event } from "../types/events";
import { GraphNode, GraphLink } from "../types/IGraphNode";

export function useForceGraph(events: Event[],containerRef: RefObject<HTMLDivElement | null>) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);

  const simRef = useRef<Simulation<GraphNode, GraphLink> | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);

  // Force tuning controls
  const [showControls, setShowControls] = useState(false);
  const [linkDistance, setLinkDistance] = useState(200);
  const [chargeStrength, setChargeStrength] = useState(-150);
  const [collideRadius, setCollideRadius] = useState(20);

  // Run d3-force simulation on mount / when events change
  useEffect(() => {
    const container = containerRef.current;
    if (!container || events.length === 0) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Derive topics dynamically from event tags
    const usedTopicLabels = [...new Set(events.flatMap((e) => e.tags))];
    const topics = usedTopicLabels.map((label) => ({
      id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label,
    }));

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
    const topicLabelToId = new Map(
      topics.map((t) => [t.label, `topic-${t.id}`])
    );

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

    const linkForce = sim.force("link") as
      | ReturnType<typeof forceLink<GraphNode, GraphLink>>
      | undefined;
    if (linkForce) linkForce.distance(linkDistance);

    const chargeForce = sim.force("charge") as
      | ReturnType<typeof forceManyBody>
      | undefined;
    if (chargeForce) chargeForce.strength(chargeStrength);

    const collideForce = sim.force("collide") as
      | ReturnType<typeof forceCollide<GraphNode>>
      | undefined;
    if (collideForce)
      collideForce.radius((d: GraphNode) => d.radius + collideRadius);

    sim.alpha(0.5).restart();
  }, [linkDistance, chargeStrength, collideRadius]);

  return {
    nodes,
    links,
    forceControls: {
      showControls,
      setShowControls,
      linkDistance,
      setLinkDistance,
      chargeStrength,
      setChargeStrength,
      collideRadius,
      setCollideRadius,
    },
  };
}
