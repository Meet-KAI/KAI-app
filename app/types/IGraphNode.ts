import { SimulationNodeDatum, SimulationLinkDatum } from "d3-force";
import { Event } from "./events";

export interface GraphNode extends SimulationNodeDatum {
  id: string;
  type: "event" | "topic";
  radius: number;
  label: string;
  event?: Event;
}

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}