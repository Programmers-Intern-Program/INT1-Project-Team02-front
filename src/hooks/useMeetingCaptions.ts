import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import type { CaptionEvent } from "../api/types";

export type CaptionConnectionStatus = "disconnected" | "connecting" | "connected";

function buildStompBrokerUrl(): string {
  const base = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");
  return base.replace(/^http/, "ws") + "/ws";
}

export function useMeetingCaptions(meetingId: number | null) {
  const [captions, setCaptions] = useState<CaptionEvent[]>([]);
  const [currentPartials, setCurrentPartials] = useState<Map<string, CaptionEvent>>(new Map());
  const [stompConnected, setStompConnected] = useState(false);

  const canConnect = meetingId != null;

  // "connecting" 상태를 파생 계산해 effect 내 동기 setState 제거
  const connectionStatus: CaptionConnectionStatus = !canConnect
    ? "disconnected"
    : stompConnected
      ? "connected"
      : "connecting";

  useEffect(() => {
    if (!canConnect || meetingId == null) return;

    const client = new Client({
      brokerURL: buildStompBrokerUrl(),
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
      },
      onDisconnect: () => setStompConnected(false),
      onStompError: () => setStompConnected(false),
    });

    client.activate();

    return () => {
      client.deactivate();
      setStompConnected(false);
    };
  }, [canConnect, meetingId]);

  return { captions, currentPartials, connectionStatus };
}
