import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { stompBrokerUrl } from "../api/client";
import type { ContextProgressEvent } from "../api/types";

export function useContextProgress(meetingId: number | null) {
  const [progress, setProgress] = useState<ContextProgressEvent | null>(null);

  useEffect(() => {
    setProgress(null);
    if (meetingId == null) return;

    const client = new Client({
      brokerURL: stompBrokerUrl,
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/meetings/${meetingId}/context-progress`, (message) => {
          const event = JSON.parse(message.body) as ContextProgressEvent;
          if (event.meetingId !== meetingId) return;
          setProgress(event);
        });
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [meetingId]);

  return progress;
}
