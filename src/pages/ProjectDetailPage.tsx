import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, CheckCircle2, ListTodo, MessageSquareText } from "lucide-react";
import { getProject, getProjectDecisions, getProjectMeetings } from "../api/flodi";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { formatDateTime } from "../lib/utils";

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const projectQuery = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
    enabled: Boolean(projectId),
  });
  const decisionsQuery = useQuery({
    queryKey: ["project-decisions", projectId],
    queryFn: () => getProjectDecisions(projectId),
    enabled: Boolean(projectId),
  });
  const meetingsQuery = useQuery({
    queryKey: ["project-meetings", projectId],
    queryFn: () => getProjectMeetings(projectId),
    enabled: Boolean(projectId),
  });

  const project = projectQuery.data;
  const decisions = decisionsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Project ${projectId}`}
        title={project?.name ?? "프로젝트 상세"}
        description={project?.description ?? "프로젝트 정보와 결정사항을 확인합니다."}
        actions={project?.techStack && <Badge tone="blue">{project.techStack}</Badge>}
      />

      {projectQuery.isLoading ? (
        <Panel><p className="text-sm text-slate-500">프로젝트를 불러오는 중입니다.</p></Panel>
      ) : projectQuery.isError ? (
        <EmptyState title="프로젝트를 불러오지 못했습니다" description="백엔드 연결 또는 프로젝트 ID를 확인해주세요." />
      ) : !project ? (
        <EmptyState title="프로젝트 없음" description="API 응답이 비어 있습니다." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Panel title="Project overview">
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Server</dt><dd className="font-medium text-slate-800">{project.serverId ?? "미연결"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Created</dt><dd className="font-medium text-slate-800">{formatDateTime(project.createdAt)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-slate-500">Tech stack</dt><dd className="font-medium text-slate-800">{project.techStack ?? "미등록"}</dd></div>
            </dl>
          </Panel>

          <Panel title="Related meetings">
            {meetingsQuery.isLoading ? (
              <p className="text-sm text-slate-500">회의 목록을 불러오는 중입니다.</p>
            ) : meetingsQuery.isError ? (
              <EmptyState title="회의 목록을 불러오지 못했습니다" icon={<MessageSquareText size={18} />} />
            ) : !meetingsQuery.data?.length ? (
              <EmptyState title="회의 없음" description="봇에서 회의를 시작하면 이곳에 표시됩니다." icon={<MessageSquareText size={18} />} />
            ) : (
              <div className="space-y-2">
                {meetingsQuery.data.map((meeting) => (
                  <Link
                    key={meeting.id}
                    to={`/meetings/${meeting.id}`}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm hover:border-slate-300 hover:bg-white"
                  >
                    <span className="font-medium text-slate-800">{meeting.title ?? `회의 #${meeting.id}`}</span>
                    <span className="text-xs text-slate-500">{formatDateTime(meeting.startedAt)}</span>
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Decisions" className="lg:col-span-2">
            {decisionsQuery.isLoading ? (
              <p className="text-sm text-slate-500">결정사항을 불러오는 중입니다.</p>
            ) : decisionsQuery.isError ? (
              <EmptyState title="결정사항을 불러오지 못했습니다" icon={<CheckCircle2 size={18} />} />
            ) : decisions.length ? (
              <div className="space-y-3">
                {decisions.map((decision) => (
                  <div key={decision.id} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={17} />
                    <div>
                      <p className="text-sm text-slate-800">{decision.content}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDateTime(decision.decidedAt)}</p>
                      {decision.meetingId && <Link to={`/meetings/${decision.meetingId}`} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-950"><CalendarDays size={13} />회의 #{decision.meetingId}</Link>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="결정사항 없음" icon={<CheckCircle2 size={18} />} />
            )}
          </Panel>

          <Panel title="Active work logs" className="lg:col-span-2">
            <EmptyState title="작업 로그 조회 API 연결 대기" description="회의 context에는 작업 로그 요약이 포함되지만 프로젝트 단독 조회 API는 아직 구현되어 있지 않습니다." icon={<ListTodo size={18} />} />
          </Panel>
        </div>
      )}
    </div>
  );
}
