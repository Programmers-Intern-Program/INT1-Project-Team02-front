import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Hash, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/flodi";
import type { Project } from "../api/types";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { useProjectsLiveStatus } from "../hooks/useProjectsLiveStatus";
import { useProjectsStatusSocket } from "../hooks/useProjectsStatusSocket";
import { formatDateTime } from "../lib/utils";


type ServerGroup = {
  serverId: string | number | null;
  serverName: string | null;
  projects: Project[];
};

function groupByServer(projects: Project[]): ServerGroup[] {
  const map = new Map<string, ServerGroup>();
  for (const project of projects) {
    const key = String(project.serverId ?? "unknown");
    if (!map.has(key)) {
      map.set(key, { serverId: project.serverId ?? null, serverName: project.serverName ?? null, projects: [] });
    }
    map.get(key)!.projects.push(project);
  }
  return Array.from(map.values());
}

export function ProjectsPage() {
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = projectsQuery.data ?? [];
  const liveStatus = useProjectsLiveStatus(projects, () => void projectsQuery.refetch());
  useProjectsStatusSocket();
  const serverGroups = groupByServer(projects);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title="프로젝트 목록"
        description="참여 중인 Discord 서버와 채널별로 프로젝트를 확인합니다."
      />

      {projectsQuery.isLoading ? (
        <p className="text-sm text-[#CBD5E1]">프로젝트 목록을 불러오는 중입니다.</p>
      ) : projectsQuery.isError ? (
        <EmptyState
          title="프로젝트 목록을 불러오지 못했습니다"
          description="백엔드 서버 또는 API base URL을 확인해 주세요."
        />
      ) : !projects.length ? (
        <EmptyState
          title="프로젝트 없음"
          description="Discord 봇으로 프로젝트를 생성하면 이곳에 표시됩니다."
        />
      ) : (
        <div className="space-y-10">
          {serverGroups.map((server) => (
            <div key={String(server.serverId ?? "unknown")}>
              {/* 서버 헤더 */}
              <div className="mb-4 flex items-center gap-2 border-b border-[#303049] pb-3">
                <div className="flex size-6 items-center justify-center rounded-md bg-[#D7A86E]/10">
                  <Server size={13} className="text-[#D7A86E]" />
                </div>
                <span className="text-sm font-semibold text-[#F8FAFC]">
                  {server.serverName ?? `서버 ${server.serverId}`}
                </span>
                <span className="ml-auto text-xs text-[#CBD5E1]/50">{server.projects.length}개 채널</span>
              </div>

              {/* 프로젝트 카드 그리드 */}
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {server.projects.map((project) => {
                  const isLive = liveStatus.get(project.id) != null;
                  const to = project.channelId
                    ? `/channels/${project.channelId}/dashboard`
                    : `/projects/${project.id}`;

                  return (
                    <Link
                      key={project.id}
                      to={to}
                      className="group relative flex flex-col rounded-lg border border-[#303049] bg-[#1B1B2A] p-4 transition hover:border-[#D7A86E]/30 hover:bg-[#24243A]"
                    >
                      {/* 채널명 */}
                      <div className="mb-3 flex items-center gap-1">
                        <Hash size={12} className="text-[#D7A86E]" />
                        <span className="text-xs font-medium text-[#D7A86E]">
                          {project.channelName ?? project.channelId ?? "알 수 없는 채널"}
                        </span>
                      </div>

                      {/* 프로젝트명 + 화살표/라이브 */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#F8FAFC]">{project.name}</p>
                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#CBD5E1]">
                            {project.description ?? "설명이 아직 없습니다."}
                          </p>
                        </div>
                        {isLive ? (
                          <span className="relative mt-1 flex size-2.5 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
                            <span className="relative inline-flex size-2.5 rounded-full bg-[#10B981]" />
                          </span>
                        ) : (
                          <ArrowRight
                            size={16}
                            className="mt-1 shrink-0 text-[#CBD5E1]/40 transition group-hover:translate-x-0.5 group-hover:text-[#D7A86E]"
                          />
                        )}
                      </div>

                      {/* 배지 */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {isLive && <Badge tone="green">회의 중</Badge>}
                        {project.techStack && <Badge tone="blue">{project.techStack}</Badge>}
                        <span className="ml-auto text-xs text-[#CBD5E1]/40">{formatDateTime(project.createdAt)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
