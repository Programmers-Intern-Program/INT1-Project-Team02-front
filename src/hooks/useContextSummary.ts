import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { stompBrokerUrl } from "../api/client";
import { getRollingSummary } from "../api/flodi";
import type { ContextSummaryEvent } from "../api/types";

type SummaryState = {
  meetingId: number | null;
  summary: string | null;
  version: number;
};

const INITIAL_STATE: SummaryState = { meetingId: null, summary: null, version: 0 };

export function useContextSummary(meetingId: number | null) {
  const [state, setState] = useState<SummaryState>(INITIAL_STATE);

  useEffect(() => {
    if (meetingId == null) return;
    let cancelled = false;
    getRollingSummary(meetingId)
      .then((data) => {
        if (cancelled || data == null) return;
        setState((prev) =>
          prev.meetingId !== meetingId || data.version > prev.version
            ? { meetingId, summary: data.summary, version: data.version }
            : prev,
        );
      })
      .catch(() => {
        // 요약이 아직 없으면 noContent(204) → apiRequest throws → 무시
      });
    return () => {
      cancelled = true;
    };
  }, [meetingId]);

  useEffect(() => {
    if (meetingId == null) return;

    const client = new Client({
      brokerURL: stompBrokerUrl,
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/meetings/${meetingId}/context`, (message) => {
          const event = JSON.parse(message.body) as ContextSummaryEvent;
          if (event.meetingId !== meetingId) return;
          setState((prev) =>
            prev.meetingId !== meetingId || event.version > prev.version
              ? { meetingId, summary: event.summary, version: event.version }
              : prev,
          );
        });
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [meetingId]);

  const isCurrentMeeting = state.meetingId === meetingId;
  return {
    summary: isCurrentMeeting ? state.summary : null,
    version: isCurrentMeeting ? state.version : 0,
  };
}
