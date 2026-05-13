import { Client } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { stompBrokerUrl } from "../api/client";

/**
 * /topic/projects/status 를 구독해 project.created 이벤트 수신 시
 * ["projects"] 쿼리를 무효화한다.
 */
export function useProjectsStatusSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const client = new Client({
      brokerURL: stompBrokerUrl,
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe("/topic/projects/status", (frame) => {
          try {
            const message = JSON.parse(frame.body) as { type: string };
            if (message.type === "project.created") {
              void queryClient.invalidateQueries({ queryKey: ["projects"] });
            }
          } catch {
            // 파싱 실패 시 무시
          }
        });
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
  }, [queryClient]);
}
