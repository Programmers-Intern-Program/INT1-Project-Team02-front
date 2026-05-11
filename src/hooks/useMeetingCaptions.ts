import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { stompBrokerUrl } from "../api/client";
import type { CaptionEvent } from "../api/types";

export type CaptionConnectionStatus = "disconnected" | "connecting" | "connected";

export function useMeetingCaptions(meetingId: number | null, onMeetingEnded?: (meetingId: number) => void) {
  const [captions, setCaptions] = useState<CaptionEvent[]>([]);
  const [currentPartials, setCurrentPartials] = useState<Map<string, CaptionEvent>>(new Map());
  const [stompConnected, setStompConnected] = useState(false);

  // ref로 관리해 dependency array에서 제외 — 콜백이 바뀌어도 재연결하지 않음
  const onMeetingEndedRef = useRef(onMeetingEnded);
  useEffect(() => {
    onMeetingEndedRef.current = onMeetingEnded;
  }, [onMeetingEnded]);

  const canConnect = meetingId != null;

  const connectionStatus: CaptionConnectionStatus = !canConnect
    ? "disconnected"
    : stompConnected
      ? "connected"
      : "connecting";

  useEffect(() => {
    if (!canConnect || meetingId == null) return;

    const client = new Client({
      brokerURL: stompBrokerUrl,
      reconnectDelay: 3000,
      onConnect: () => {
        setStompConnected(true);

        client.subscribe(`/topic/meetings/${meetingId}/captions`, (message) => {
          const event = JSON.parse(message.body) as CaptionEvent;
          if (event.isFinal) {
            setCaptions((prev) => [...prev, event]);
            setCurrentPartials((prev) => {
              const next = new Map(prev);
              next.delete(event.speakerDiscordId);
              return next;
            });
          } else {
            setCurrentPartials((prev) => {
              const existing = prev.get(event.speakerDiscordId);
              if (existing && existing.sequence > event.sequence) return prev;
              const next = new Map(prev);
              next.set(event.speakerDiscordId, event);
              return next;
            });
          }
        });

        client.subscribe(`/topic/meetings/${meetingId}/status`, (message) => {
          const event = JSON.parse(message.body) as { type: string; meetingId: number };
          if (event.type === "meeting.ended") {
            onMeetingEndedRef.current?.(event.meetingId);
          }
        });
      },
      onDisconnect: () => setStompConnected(false),
      onStompError: () => setStompConnected(false),
    });

    client.activate();

    return () => {
      client.deactivate();
      setStompConnected(false);
      setCaptions([]);
      setCurrentPartials(new Map());
    };
  }, [canConnect, meetingId]);

  return { captions, currentPartials, connectionStatus };
}
