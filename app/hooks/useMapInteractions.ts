import { useCallback, RefObject } from "react";
import { Event } from "../types/events";
import { GraphNode } from "../types/IGraphNode";

export function useMapInteractions(
  onSelectEvent: (event: Event | null) => void,
  onSelectTopic: (topic: string | null) => void,
  isPanning: RefObject<boolean>
) {
  const handleEventClick = useCallback(
    (e: React.MouseEvent, event: Event) => {
      e.stopPropagation();
      onSelectEvent(event);
    },
    [onSelectEvent]
  );

  const handleTopicClick = useCallback(
    (e: React.MouseEvent, node: GraphNode) => {
      e.stopPropagation();
      onSelectTopic(node.label);
    },
    [onSelectTopic]
  );

  const handleBackgroundClick = useCallback(() => {
    if (!isPanning.current) {
      onSelectEvent(null);
      onSelectTopic(null);
    }
  }, [onSelectEvent, onSelectTopic, isPanning]);

  return { handleEventClick, handleTopicClick, handleBackgroundClick };
}
