import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, ChevronDown, Clock, Hash, ListTodo, MessageSquareText, Server, UserRound, XCircle } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject, getProjectDecisions, getProjectMeetings, getProjectWorkLogs } from "../api/flodi";
import type { Meeting } from "../api/types";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Panel } from "../components/ui/Panel";
import { StatusPill } from "../components/ui/StatusPill";
import { formatDateTime, formatMeetingTitle } from "../lib/utils";

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

function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Link
      to={`/meetings/${meeting.id}`}
      className="group flex items-center gap-3 rounded-md border border-[#303049] bg-[#1B1B2A] px-3 py-2.5 transition hover:border-[#D7A86E]/30 hover:bg-[#24243A]"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#F8FAFC]">
          {formatMeetingTitle(meeting.title, meeting.startedAt)}
        </p>
        <p className="mt-0.5 text-xs text-[#CBD5E1]/60">{formatDateTime(meeting.startedAt)}</p>
      </div>
      <StatusPill status={meeting.status} />
    </Link>
  );
}

export function ProjectDetailPage() {
  const { projectId = "" } = useParams();
  const [cancelledOpen, setCancelledOpen] = useState(false);

  const projectQuery = useQuery({ queryKey: ["project", projectId], queryFn: () => getProject(projectId), enabled: Boolean(projectId) });
  const decisionsQuery = useQuery({ queryKey: ["project-decisions", projectId], queryFn: () => getProjectDecisions(projectId), enabled: Boolean(projectId) });
  const meetingsQuery = useQuery({ queryKey: ["project-meetings", projectId], queryFn: () => getProjectMeetings(projectId), enabled: Boolean(projectId) });
  const workLogsQuery = useQuery({ queryKey: ["project-work-logs", projectId], queryFn: () => getProjectWorkLogs(projectId), enabled: Boolean(projectId) });

  const project = projectQuery.data;
  const decisions = decisionsQuery.data ?? [];
  const meetings = meetingsQuery.data ?? [];
  const workLogs = workLogsQuery.data ?? [];

  if (projectQuery.isLoading) {
    return <p className="text-sm text-[#CBD5E1]">프로젝트를 불러오는 중입니다.</p>;
  }
  if (projectQuery.isError) {
    return <EmptyState title="프로젝트를 불러오지 못했습니다" description="백엔드 연결 또는 프로젝트 ID를 확인해 주세요." />;
  }
  if (!project) {
    return <EmptyState title="프로젝트 없음" description="API 응답이 비어 있습니다." />;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 — Project overview 카드 제거, 메타정보를 인라인으로 */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#D7A86E]">Project {projectId}</p>
        <h1 className="mt-1 text-2xl font-semibold text-[#F8FAFC]">{project.name}</h1>
        {project.description && (
          <p className="mt-1 text-sm leading-6 text-[#CBD5E1]">{project.description}</p>
        )}
        {/* 메타 배지 */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#CBD5E1]">
          {project.serverName && (
            <span className="flex items-center gap-1">
              <Server size={12} className="text-[#D7A86E]" />
              {project.serverName}
            </span>
          )}
          {project.channelName && (
            <span className="flex items-center gap-1">
              <Hash size={12} className="text-[#D7A86E]" />
              {project.channelName}
            </span>
          )}
          {project.techStack && <Badge tone="blue">{project.techStack}</Badge>}
          {project.createdAt && (
            <span className="text-[#CBD5E1]/50">{formatDateTime(project.createdAt)} 생성</span>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* 회의 기록 */}
        <Panel title="회의 기록">
          {meetingsQuery.isLoading ? (
            <p className="text-sm text-[#CBD5E1]">불러오는 중...</p>
          ) : meetingsQuery.isError ? (
            <EmptyState title="회의 기록을 불러오지 못했습니다" icon={<MessageSquareText size={18} />} />
          ) : !meetings.length ? (
            <EmptyState title="회의 없음" description="봇에서 회의를 시작하면 이곳에 표시됩니다." icon={<MessageSquareText size={18} />} />
          ) : (
            <div className="space-y-2">
              {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} />)}
            </div>
          )}
        </Panel>

        {/* 결정사항 */}
        <Panel title="결정사항">
          {decisionsQuery.isLoading ? (
            <p className="text-sm text-[#CBD5E1]">불러오는 중...</p>
          ) : decisionsQuery.isError ? (
            <EmptyState title="결정사항을 불러오지 못했습니다" icon={<CheckCircle2 size={18} />} />
          ) : decisions.length ? (
            <div className="space-y-3">
              {decisions.map((decision) => (
                <div key={decision.id} className="flex gap-3 rounded-md border border-[#303049] bg-[#1B1B2A] p-3">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[#D7A86E]" size={16} />
                  <div className="min-w-0">
                    <p className="text-sm text-[#F8FAFC]">{decision.content}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="text-xs text-[#CBD5E1]/60">{formatDateTime(decision.decidedAt)}</span>
                      {decision.meetingId && (
                        <Link to={`/meetings/${decision.meetingId}`} className="inline-flex items-center gap-1 text-xs text-[#D7A86E] hover:underline">
                          <CalendarDays size={11} />회의 #{decision.meetingId}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="결정사항 없음" icon={<CheckCircle2 size={18} />} />
          )}
        </Panel>

        {/* 작업 로그 — 칸반 */}
        <Panel title="작업 로그" className="lg:col-span-2">
          {workLogsQuery.isLoading ? (
            <p className="text-sm text-[#CBD5E1]">불러오는 중...</p>
          ) : workLogsQuery.isError ? (
            <EmptyState title="작업 로그를 불러오지 못했습니다" icon={<ListTodo size={18} />} />
          ) : !workLogs.length ? (
            <EmptyState title="작업 로그 없음" description="회의에서 작업이 등록되면 이곳에 표시됩니다." icon={<ListTodo size={18} />} />
          ) : (() => {
            const activeLogs = workLogs.filter((l) => l.status !== "CANCELLED");
            const cancelledLogs = workLogs.filter((l) => l.status === "CANCELLED");
            return (
              <div className="space-y-4">
                {/* 메인 칸반 — 3열 */}
                <div className="grid gap-4 sm:grid-cols-3">
                  {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => {
                    const logs = activeLogs.filter((l) => (l.status ?? "TODO") === status);
                    return (
                      <div key={status}>
                        <div className="mb-3 flex items-center gap-2">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>
                            {STATUS_LABEL[status]}
                          </span>
                          <span className="text-xs text-[#CBD5E1]/40">{logs.length}개</span>
                        </div>
                        <div className="space-y-2">
                          {logs.length === 0 ? (
                            <p className="rounded-md border border-dashed border-[#303049] p-3 text-center text-xs text-[#CBD5E1]/30">없음</p>
                          ) : logs.map((log) => (
                            <div key={log.id} className="flex flex-col gap-2 rounded-md border border-[#303049] bg-[#1B1B2A] p-3">
                              <p className="text-sm font-medium text-[#F8FAFC]">{log.task}</p>
                              <div className="flex items-center justify-between gap-2">
                                <span className="flex items-center gap-1 text-xs text-[#CBD5E1]">
                                  <UserRound size={11} />{log.assigneeName ?? "미정"}
                                </span>
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

                {/* 취소됨 섹션 — 접기/펼치기 */}
                {cancelledLogs.length > 0 && (
                  <div className="border-t border-[#303049] pt-3">
                    <button
                      onClick={() => setCancelledOpen((o) => !o)}
                      className="flex items-center gap-2 text-xs text-[#CBD5E1]/50 hover:text-[#CBD5E1] transition"
                    >
                      <XCircle size={13} className="text-red-400/60" />
                      취소됨 {cancelledLogs.length}개
                      <ChevronDown size={13} className={`transition-transform ${cancelledOpen ? "rotate-180" : ""}`} />
                    </button>
                    {cancelledOpen && (
                      <div className="mt-3 space-y-2">
                        {cancelledLogs.map((log) => (
                          <div key={log.id} className="flex items-center justify-between rounded-md border border-[#303049]/60 bg-[#1B1B2A]/50 px-3 py-2 opacity-60">
                            <div className="flex items-center gap-2">
                              <XCircle size={13} className="shrink-0 text-red-400/60" />
                              <span className="text-sm text-[#CBD5E1] line-through">{log.task}</span>
                            </div>
                            <span className="flex items-center gap-1 text-xs text-[#CBD5E1]/50">
                              <UserRound size={11} />{log.assigneeName ?? "미정"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </Panel>
      </div>
    </div>
  );
}
