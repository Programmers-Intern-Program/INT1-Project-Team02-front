import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Hash, MessageSquareText, Server } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getMeeting, getRollingSummary } from "../api/flodi";
import { EmptyState } from "../components/ui/EmptyState";
import { Panel } from "../components/ui/Panel";
import { StatusPill } from "../components/ui/StatusPill";
import { formatDateTime, formatMeetingTitle } from "../lib/utils";

export function MeetingDetailPage() {
  const { meetingId = "" } = useParams();
  const meetingQuery = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => getMeeting(meetingId),
    enabled: Boolean(meetingId),
  });
  const summaryQuery = useQuery({
    queryKey: ["meeting-rolling-summary", meetingId],
    queryFn: () => getRollingSummary(Number(meetingId)),
    enabled: Boolean(meetingId),
  });

  const meeting = meetingQuery.data;
  const summary = summaryQuery.data?.summary ?? null;

  if (meetingQuery.isLoading) {
    return <p className="text-sm text-[#CBD5E1]">회의 정보를 불러오는 중입니다.</p>;
  }
  if (meetingQuery.isError) {
    return <EmptyState title="회의를 불러오지 못했습니다" description="백엔드 연결 또는 회의 ID를 확인해 주세요." />;
  }
  if (!meeting) {
    return <EmptyState title="회의 없음" description="API 응답이 비어 있습니다." />;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 — Meeting overview 카드 제거, 인라인으로 */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#D7A86E]">Meeting {meetingId}</p>
        <div className="mt-1 flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#F8FAFC]">
            {formatMeetingTitle(meeting.title, meeting.startedAt)}
          </h1>
          {meeting.status && <StatusPill status={meeting.status} />}
        </div>

        {/* 메타 정보 인라인 */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#CBD5E1]">
          <Link to={`/projects/${meeting.projectId}`} className="flex items-center gap-1 hover:text-[#D7A86E]">
            <Server size={12} className="text-[#D7A86E]" />
            프로젝트 #{meeting.projectId}
          </Link>
          {meeting.startedAt && (
            <span className="flex items-center gap-1">
              <CalendarDays size={12} className="text-[#D7A86E]" />
              시작 {formatDateTime(meeting.startedAt)}
            </span>
          )}
          {meeting.endedAt && (
            <span className="flex items-center gap-1">
              <Hash size={12} className="text-[#CBD5E1]/50" />
              종료 {formatDateTime(meeting.endedAt)}
            </span>
          )}
        </div>
      </div>

      {/* 요약 */}
      <Panel title="Summary">
        {summaryQuery.isLoading ? (
          <p className="text-sm text-[#CBD5E1]">요약을 불러오는 중입니다.</p>
        ) : summary ? (
          <p className="whitespace-pre-wrap text-sm leading-7 text-[#F8FAFC]">{summary}</p>
        ) : (
          <EmptyState
            title="요약 없음"
            description="회의가 종료되면 AI 요약이 생성됩니다."
            icon={<MessageSquareText size={18} />}
          />
        )}
      </Panel>
    </div>
  );
}
