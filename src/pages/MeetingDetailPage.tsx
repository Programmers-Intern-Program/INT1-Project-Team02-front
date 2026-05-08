import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ListTodo, MessageSquareText, UserRound } from "lucide-react";
import { getMeeting, getMeetingContext } from "../api/flodi";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { StatusPill } from "../components/ui/StatusPill";
import { asArray, formatDateTime } from "../lib/utils";

export function MeetingDetailPage() {
  const { meetingId = "" } = useParams();
  const meetingQuery = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => getMeeting(meetingId),
    enabled: Boolean(meetingId),
  });
  const contextQuery = useQuery({
    queryKey: ["meeting-context", meetingId],
    queryFn: () => getMeetingContext(meetingId),
    enabled: Boolean(meetingId),
  });

  const meeting = meetingQuery.data;
  const context = contextQuery.data;
  const startContext = context?.startContext;
  const decisions = asArray(startContext?.recentDecisions);
  const summaries = asArray(startContext?.recentSummaries);
  const workLogs = asArray(startContext?.activeWorkLogs);
  const utterances = asArray(context?.shortTerm?.recentUtterances);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Meeting ${meetingId}`}
        title={meeting?.title ?? (startContext?.projectName ? `${startContext.projectName} 회의` : "회의 상세")}
        description="회의 기본 정보는 공개 API에서, 요약/결정사항/작업 로그 컨텍스트는 internal context API에서 보조로 불러옵니다."
        actions={meeting?.status && <StatusPill status={meeting.status} />}
      />

      {meetingQuery.isLoading ? (
        <Panel><p className="text-sm text-slate-500">회의 정보를 불러오는 중입니다.</p></Panel>
      ) : meetingQuery.isError ? (
        <EmptyState title="회의를 불러오지 못했습니다" description="백엔드 연결 또는 회의 ID를 확인해주세요." />
      ) : !meeting ? (
        <EmptyState title="회의 없음" description="API 응답이 비어 있습니다." />
      ) : (
        <>
          <Panel title="Meeting overview">
            <dl className="grid gap-3 text-sm md:grid-cols-2">
              <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3"><dt className="text-slate-500">Project</dt><dd className="font-medium text-slate-800"><Link to={`/projects/${meeting.projectId}`}>#{meeting.projectId}</Link></dd></div>
              <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3"><dt className="text-slate-500">Started</dt><dd className="font-medium text-slate-800">{formatDateTime(meeting.startedAt)}</dd></div>
              <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3"><dt className="text-slate-500">Ended</dt><dd className="font-medium text-slate-800">{formatDateTime(meeting.endedAt)}</dd></div>
              <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3"><dt className="text-slate-500">Status</dt><dd><StatusPill status={meeting.status} /></dd></div>
            </dl>
          </Panel>

          <Panel title="Summary">
            {contextQuery.isLoading ? (
              <p className="text-sm text-slate-500">회의 컨텍스트를 불러오는 중입니다.</p>
            ) : contextQuery.isError ? (
              <EmptyState title="회의 컨텍스트 연결 대기" description="기본 회의 정보는 표시 중이며, internal context API가 준비되면 요약이 표시됩니다." icon={<MessageSquareText size={18} />} />
            ) : context?.shortTerm?.rollingSummary || summaries.length ? (
              <div className="space-y-3 text-sm leading-6 text-slate-700">
                {context?.shortTerm?.rollingSummary && <p className="whitespace-pre-wrap">{context.shortTerm.rollingSummary}</p>}
                {summaries.map((summary) => <p key={summary.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">{summary.summary}</p>)}
              </div>
            ) : (
              <EmptyState title="요약 없음" icon={<MessageSquareText size={18} />} />
            )}
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel title="Decisions">
              {decisions.length ? (
                <div className="space-y-3">
                  {decisions.map((decision) => (
                    <div key={decision.id} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={17} />
                      <div>
                        <p className="text-sm text-slate-800">{decision.content}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatDateTime(decision.decidedAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="결정사항 없음" icon={<CheckCircle2 size={18} />} />
              )}
            </Panel>

            <Panel title="Work logs">
              {workLogs.length ? (
                <div className="space-y-3">
                  {workLogs.map((workLog) => (
                    <div key={workLog.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <StatusPill status={workLog.status} />
                      <p className="mt-2 text-sm font-medium text-slate-800">{workLog.task}</p>
                      <p className="mt-2 text-xs text-slate-500">{workLog.assigneeName ?? "담당자 미정"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="작업 로그 없음" icon={<ListTodo size={18} />} />
              )}
            </Panel>
          </div>

          <Panel title="Recent utterances">
            {utterances.length ? (
              <div className="divide-y divide-slate-100">
                {utterances.map((utterance, index) => (
                  <div key={`${utterance.speechStartedAt}-${index}`} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-500"><UserRound size={16} /></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{utterance.speakerName ?? "Unknown speaker"}</p>
                      <p className="mt-1 text-sm text-slate-600">{utterance.content}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatDateTime(utterance.speechStartedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="최근 발화 없음" icon={<UserRound size={18} />} />
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
