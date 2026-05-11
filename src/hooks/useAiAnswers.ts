import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { stompBrokerUrl } from "../api/client";
import type { AiAnswerEvent } from "../api/types";

export function useAiAnswers(meetingId: number | null) {
  // utteranceId → event (PENDING이 COMPLETED/FALLBACK으로 덮어씌워짐)
  const [answersMap, setAnswersMap] = useState<Map<number, AiAnswerEvent>>(new Map());

  useEffect(() => {
    if (meetingId == null) return;

    const client = new Client({
      brokerURL: stompBrokerUrl,
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/meetings/${meetingId}/ai-answer`, (message) => {
          const event = JSON.parse(message.body) as AiAnswerEvent;
          setAnswersMap((prev) => {
            const next = new Map(prev);
            next.set(event.utteranceId, event);
            return next;
          });
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      setAnswersMap(new Map());
    };
  }, [meetingId]);

  // utteranceId 오름차순 (발화 순서대로) — 최신이 아래
  const answers = Array.from(answersMap.values()).sort((a, b) => a.utteranceId - b.utteranceId);

  return { answers };
}
