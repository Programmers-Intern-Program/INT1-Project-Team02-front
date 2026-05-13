import { Client } from "@stomp/stompjs";
import { useEffect, useMemo, useRef } from "react";
import { stompBrokerUrl } from "../api/client";
import type { Project } from "../api/types";

export function useProjectsLiveStatus(
  projects: Project[],
  onStatusChange: () => void,
): Map<number, number | null> {
  // ref로 관리해 dependency array에서 제외 — 콜백이 바뀌어도 재연결하지 않음
  const onStatusChangeRef = useRef(onStatusChange);
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  });

  const projectsKey = projects.map((p) => p.id).join(",");

  useEffect(() => {
    if (projects.length === 0) return;

    const client = new Client({
      brokerURL: stompBrokerUrl,
      reconnectDelay: 3000,
      onConnect: () => {
        projects.forEach((project) => {
          client.subscribe(`/topic/projects/${project.id}/status`, () => {
            onStatusChangeRef.current();
          });
        });
        // 구독 완료 직후 한 번 재조회 — 구독 전 발생한 이벤트 보정
        onStatusChangeRef.current();
      },
    });

    client.activate();
    return () => {
      client.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectsKey]);

  return useMemo(
    () => new Map(projects.map((p) => [p.id, p.activeMeetingId ?? null])),
    [projects],
  );
}
