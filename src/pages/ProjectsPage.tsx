import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FolderKanban, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/flodi";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { useProjectsLiveStatus } from "../hooks/useProjectsLiveStatus";
import { useProjectsStatusSocket } from "../hooks/useProjectsStatusSocket";
import { formatDateTime } from "../lib/utils";

export function ProjectsPage() {
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = projectsQuery.data ?? [];
  const liveStatus = useProjectsLiveStatus(projects, () => void projectsQuery.refetch());
  useProjectsStatusSocket();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Projects"
        title="프로젝트 목록"
        description="백엔드의 GET /api/v1/projects를 사용해 프로젝트를 조회합니다."
        actions={<Button variant="secondary" disabled><Plus size={16} />새 프로젝트</Button>}
      />
      <Panel>
        {projectsQuery.isLoading ? (
          <p className="text-sm text-[#CBD5E1]">프로젝트 목록을 불러오는 중입니다.</p>
        ) : projectsQuery.isError ? (
          <EmptyState title="프로젝트 목록을 불러오지 못했습니다" description="백엔드 서버 또는 API base URL을 확인해 주세요." icon={<FolderKanban size={18} />} />
        ) : !projects.length ? (
          <EmptyState title="프로젝트 없음" description="Discord 봇 또는 API로 프로젝트를 생성하면 이곳에 표시됩니다." icon={<FolderKanban size={18} />} />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const isLive = liveStatus.get(project.id) != null;
              const to = project.channelId
                ? `/channels/${project.channelId}/dashboard`
                : `/projects/${project.id}`;

              return (
                <Link
                  key={project.id}
                  to={to}
                  className="group rounded-md border border-[#303049] bg-[#1B1B2A] p-4 transition hover:bg-[#24243A]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#F8FAFC]">{project.name}</p>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#CBD5E1]">{project.description ?? "설명이 아직 없습니다."}</p>
                    </div>
                    {isLive ? (
                      <span className="relative mt-1.5 flex size-2.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399] opacity-75" />
                        <span className="relative inline-flex size-2.5 rounded-full bg-[#10B981]" />
                      </span>
                    ) : (
                      <ArrowRight size={16} className="mt-1 shrink-0 text-[#CBD5E1] transition group-hover:translate-x-0.5" />
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {isLive && <Badge tone="green">회의 중</Badge>}
                    {project.techStack && <Badge tone="blue">{project.techStack}</Badge>}
                    <span className="text-xs text-[#CBD5E1]/70">{formatDateTime(project.createdAt)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
