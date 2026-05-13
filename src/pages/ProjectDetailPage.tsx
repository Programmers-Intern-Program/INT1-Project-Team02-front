import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, Clock, ListTodo, MessageSquareText, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getProject, getProjectDecisions, getProjectMeetings, getProjectWorkLogs } from "../api/flodi";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { StatusPill } from "../components/ui/StatusPill";
import { MOCK_DECISIONS, MOCK_MEETINGS, MOCK_PROJECTS, MOCK_WORK_LOGS } from "../mocks/data";
import { formatDateTime } from "../lib/utils";

const USE_MOCK = import.meta.env.DEV;

const STATUS_STYLE: Record<string, string> = {
  DONE: "bg-[#10B981]/10 text-[#34D399]",
  IN_PROGRESS: "bg-[#D7A86E]/10 text-[#D7A86E]",
  TODO: "bg-[#303049] text-[#CBD5E1]",
};

const STATUS_LABEL: Record<string, string> = {
  DONE: "완료",
  IN_PROGRESS: "진행 중",
  TODO: "예정",
};

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();

  const projectQuery = useQuery({ queryKey: ["project", projectId], queryFn: () => getProject(projectId), enabled: Boolean(projectId) && !USE_MOCK });
  const decisionsQuery = useQuery({ queryKey: ["project-decisions", projectId], queryFn: () => getProjectDecisions(projectId), enabled: Boolean(projectId) && !USE_MOCK });
  const meetingsQuery = useQuery({ queryKey: ["project-meetings", projectId], queryFn: () => getProjectMeetings(projectId), enabled: Boolean(projectId) && !USE_MOCK });
  const workLogsQuery = useQuery({ queryKey: ["project-work-logs", projectId], queryFn: () => getProjectWorkLogs(projectId), enabled: Boolean(projectId) && !USE_MOCK });

  const mockProject = USE_MOCK ? (MOCK_PROJECTS.find((p) => String(p.id) === projectId) ?? MOCK_PROJECTS[0]) : undefined;
  const project = USE_MOCK ? mockProject : projectQuery.data;
  const decisions = USE_MOCK ? MOCK_DECISIONS.filter((d) => d.projectId === project?.id) : (decisionsQuery.data ?? []);
  const meetings = USE_MOCK ? MOCK_MEETINGS.filter((m) => m.projectId === project?.id) : (meetingsQuery.data ?? []);
  const workLogs = USE_MOCK ? MOCK_WORK_LOGS : (workLogsQuery.data ?? []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Project ${projectId}`}
        title={project?.name ?? "프로젝트 상세"}
        description={project?.description ?? "프로젝트 정보와 결정사항을 확인합니다."}
        actions={project?.techStack && <Badge tone="blue">{project.techStack}</Badge>}
      />

      {!USE_MOCK && projectQuery.isLoading ? (
        <Panel><p className="text-sm text-[#CBD5E1]">프로젝트를 불러오는 중입니다.</p></Panel>
      ) : !USE_MOCK && projectQuery.isError ? (
        <EmptyState title="프로젝트를 불러오지 못했습니다" description="백엔드 연결 또는 프로젝트 ID를 확인해 주세요." />
      ) : !project ? (
        <EmptyState title="프로젝트 없음" description="API 응답이 비어 있습니다." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          {/* 프로젝트 개요 */}
          <Panel title="Project overview">
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-[#CBD5E1]">Server</dt><dd className="font-medium text-[#F8FAFC]">{project.serverName ?? project.serverId ?? "미연결"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#CBD5E1]">Channel</dt><dd className="font-medium text-[#F8FAFC]">{project.channelName ?? project.channelId ?? "미연결"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#CBD5E1]">Created</dt><dd className="font-medium text-[#F8FAFC]">{formatDateTime(project.createdAt)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#CBD5E1]">Tech stack</dt><dd className="font-medium text-[#F8FAFC]">{project.techStack ?? "미등록"}</dd></div>
            </dl>
          </Panel>

          {/* 관련 회의 */}
          <Panel title="Related meetings">
            {!USE_MOCK && meetingsQuery.isLoading ? (
              <p className="text-sm text-[#CBD5E1]">회의 목록을 불러오는 중입니다.</p>
            ) : !USE_MOCK && meetingsQuery.isError ? (
              <EmptyState title="회의 목록을 불러오지 못했습니다" icon={<MessageSquareText size={18} />} />
            ) : !meetings.length ? (
              <EmptyState title="회의 없음" description="봇에서 회의를 시작하면 이곳에 표시됩니다." icon={<MessageSquareText size={18} />} />
            ) : (
              <div className="space-y-2">
                {meetings.map((meeting) => (
                  <Link key={meeting.id} to={`/meetings/${meeting.id}`} className="flex items-center justify-between rounded-md border border-[#303049] bg-[#1B1B2A] px-3 py-2 text-sm transition hover:bg-[#24243A]">
                    <span className="font-medium text-[#F8FAFC]">{meeting.title ?? `회의 #${meeting.id}`}</span>
                    <span className="text-xs text-[#CBD5E1]">{formatDateTime(meeting.startedAt)}</span>
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          {/* 결정사항 */}
          <Panel title="Decisions" className="lg:col-span-2">
            {!USE_MOCK && decisionsQuery.isLoading ? (
              <p className="text-sm text-[#CBD5E1]">결정사항을 불러오는 중입니다.</p>
            ) : !USE_MOCK && decisionsQuery.isError ? (
              <EmptyState title="결정사항을 불러오지 못했습니다" icon={<CheckCircle2 size={18} />} />
            ) : decisions.length ? (
              <div className="space-y-3">
                {decisions.map((decision) => (
                  <div key={decision.id} className="flex gap-3 rounded-md border border-[#303049] bg-[#1B1B2A] p-3">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#D7A86E]" size={17} />
                    <div>
                      <p className="text-sm text-[#F8FAFC]">{decision.content}</p>
                      <p className="mt-1 text-xs text-[#F2C98B]">{formatDateTime(decision.decidedAt)}</p>
                      {decision.meetingId && (
                        <Link to={`/meetings/${decision.meetingId}`} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#CBD5E1] hover:text-[#F8FAFC]">
                          <CalendarDays size={13} />회의 #{decision.meetingId}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="결정사항 없음" icon={<CheckCircle2 size={18} />} />
            )}
          </Panel>

          {/* 작업 로그 */}
          <Panel title="Active work logs" className="lg:col-span-2">
            {!USE_MOCK && workLogsQuery.isLoading ? (
              <p className="text-sm text-[#CBD5E1]">작업 로그를 불러오는 중입니다.</p>
            ) : !USE_MOCK && workLogsQuery.isError ? (
              <EmptyState title="작업 로그를 불러오지 못했습니다" icon={<ListTodo size={18} />} />
            ) : !workLogs.length ? (
              <EmptyState title="작업 로그 없음" description="회의에서 작업이 등록되면 이곳에 표시됩니다." icon={<ListTodo size={18} />} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => {
                  const logs = workLogs.filter((l) => (l.status ?? "TODO") === status);
                  return (
                    <div key={status}>
                      {/* 컬럼 헤더 */}
                      <div className="mb-3 flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>
                          {STATUS_LABEL[status]}
                        </span>
                        <span className="text-xs text-[#CBD5E1]/50">{logs.length}개</span>
                      </div>
                      {/* 카드 목록 */}
                      <div className="space-y-2">
                        {logs.length === 0 ? (
                          <p className="rounded-md border border-dashed border-[#303049] p-3 text-center text-xs text-[#CBD5E1]/40">없음</p>
                        ) : logs.map((log) => (
                          <div key={log.id} className="flex flex-col gap-2 rounded-md border border-[#303049] bg-[#1B1B2A] p-3">
                            <p className="text-sm font-medium text-[#F8FAFC]">{log.task}</p>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 text-xs text-[#CBD5E1]">
                                <UserRound size={11} />
                                {log.assigneeName ?? "미정"}
                              </div>
                              {log.dueDate && (
                                <span className="flex items-center gap-1 text-xs text-[#CBD5E1]/50">
                                  <Clock size={11} />{formatDateTime(log.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}
