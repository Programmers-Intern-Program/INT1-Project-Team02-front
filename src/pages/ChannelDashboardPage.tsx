import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Cable, CheckCircle2, ExternalLink, GitBranch, ListChecks, MessageSquareText } from "lucide-react";
import { getChannelDashboard } from "../api/flodi";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { StatusPill } from "../components/ui/StatusPill";
import { formatDateTime } from "../lib/utils";

export function ChannelDashboardPage() {
  const { channelId = "unknown-channel" } = useParams();
  const dashboardQuery = useQuery({
    queryKey: ["channel-dashboard", channelId],
    queryFn: () => getChannelDashboard(channelId),
  });

  const project = dashboardQuery.data?.project;
  const recentDecisions = dashboardQuery.data?.decisions ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Channel ${channelId}`}
        title={project?.name ?? "채널 대시보드"}
        description={project?.description ?? "Discord 봇의 대시보드 열기 버튼에서 진입하는 핵심 화면입니다."}
        actions={project && <Link to={`/projects/${project.id}`}><Button variant="secondary"><ExternalLink size={16} />프로젝트 상세</Button></Link>}
      />

      {dashboardQuery.isLoading ? (
        <Panel><p className="text-sm text-slate-500">채널 연결 상태를 확인하는 중입니다.</p></Panel>
      ) : dashboardQuery.isError ? (
        <EmptyState title="채널 정보를 불러오지 못했습니다" description="백엔드가 실행 중인지, VITE_API_BASE_URL이 올바른지 확인해주세요." icon={<Cable size={18} />} />
      ) : !project ? (
        <EmptyState title="연결된 프로젝트가 없습니다" description="Discord 봇에서 프로젝트를 생성하거나 현재 채널에 프로젝트를 연결하면 대시보드가 채워집니다." icon={<GitBranch size={18} />} />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Panel title="Project context">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill status="Connected" />
                  {project.techStack && <Badge tone="blue">{project.techStack}</Badge>}
                </div>
                <p className="text-sm leading-6 text-slate-600">{project.description ?? "프로젝트 설명은 아직 등록되지 않았습니다."}</p>
                <p className="text-xs text-slate-500">Created {formatDateTime(project.createdAt)}</p>
              </div>
            </Panel>

            <Panel title="Recent meetings">
              <EmptyState title="최근 회의 목록 API 연결 대기" description="현재 구현된 API에는 프로젝트별 회의 목록 조회가 없어 회의 상세 URL 또는 봇 진입으로 확인할 수 있습니다." icon={<MessageSquareText size={18} />} />
            </Panel>
          </div>

          <Panel title="Recent decisions">
            {recentDecisions.length ? (
              <div className="divide-y divide-slate-100">
                {recentDecisions.slice(0, 6).map((decision) => (
                  <div key={decision.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={17} />
                    <div>
                      <p className="text-sm text-slate-800">{decision.content}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDateTime(decision.decidedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="최근 결정사항 없음" description="프로젝트 결정사항 API는 연결되어 있습니다. 저장된 결정사항이 생기면 이곳에 표시됩니다." icon={<ListChecks size={18} />} />
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
