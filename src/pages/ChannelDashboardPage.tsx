import { useQuery } from "@tanstack/react-query";
import { Cable, CheckCircle2, ExternalLink, GitBranch, ListChecks, MessageSquareText, PictureInPicture2, Sparkles, Subtitles } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getActiveMeeting, getChannelDashboard } from "../api/flodi";
import flodiBanner from "../assets/flodi-banner.png";
import { AiAnswerPanel } from "../components/AiAnswerPanel";
import { CaptionOverlay } from "../components/CaptionOverlay";
import { ContextSummaryPanel } from "../components/ContextSummaryPanel";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Panel } from "../components/ui/Panel";
import { StatusPill } from "../components/ui/StatusPill";
import { useCaptionPiP } from "../context/useCaptionPiP";
import { useContextSummary } from "../hooks/useContextSummary";
import { formatDateTime } from "../lib/utils";

export function ChannelDashboardPage() {
  const { channelId = "unknown-channel" } = useParams();

  const {
    endedMeetingId,
    isCaptionsVisible,
    isPiPOpen,
    isPiPSupported,
    captions,
    currentPartials,
    connectionStatus,
    answers,
    showCaptions,
    hideCaptions,
    openPiP,
    closePiP,
  } = useCaptionPiP();

  const dashboardQuery = useQuery({
    queryKey: ["channel-dashboard", channelId],
    queryFn: () => getChannelDashboard(channelId),
  });

  const activeMeetingQuery = useQuery({
    queryKey: ["active-meeting", channelId],
    queryFn: () => getActiveMeeting(channelId),
    refetchInterval: 30_000,
  });

  const project = dashboardQuery.data?.project;
  const recentDecisions = dashboardQuery.data?.decisions ?? [];
  const activeMeeting = activeMeetingQuery.data ?? null;
  const { summary, version } = useContextSummary(activeMeeting?.meetingId ?? null);

  useEffect(() => {
    if (activeMeetingQuery.isSuccess && !activeMeeting && isCaptionsVisible) {
      hideCaptions();
    }
  }, [activeMeeting, activeMeetingQuery.isSuccess, isCaptionsVisible, hideCaptions]);

  const canShowCaptions = Boolean(activeMeeting) && activeMeeting?.meetingId !== endedMeetingId;

  function handleToggleCaptions() {
    if (isCaptionsVisible) hideCaptions();
    else if (activeMeeting) showCaptions(activeMeeting.meetingId);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-[#303049] bg-[#12121C] shadow-[0_18px_48px_rgba(0,0,0,0.36)]">
        <div className="grid min-h-56 lg:grid-cols-2">
          <div className="flex flex-col justify-end px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C4B5FD]">Channel {channelId}</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#F8FAFC] md:text-3xl">{project?.name ?? "채널 대시보드"}</h1>
            <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">회의 자막, AI 응답, 프로젝트 맥락을 한 화면에서 이어서 봅니다.</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button variant="secondary" disabled={!canShowCaptions} title={canShowCaptions ? undefined : "진행 중인 회의가 없습니다"} onClick={handleToggleCaptions}>
                <Subtitles size={16} />
                {isCaptionsVisible ? "자막 숨기기" : "자막 보기"}
              </Button>

              {isCaptionsVisible && canShowCaptions && (
                <Button
                  variant="secondary"
                  disabled={!isPiPSupported}
                  onClick={isPiPOpen ? closePiP : () => void openPiP()}
                  title={!isPiPSupported ? "Chrome 116 이상에서 지원됩니다" : isPiPOpen ? "자막을 페이지 안으로 되돌립니다" : "자막을 별도 창으로 분리합니다"}
                >
                  <PictureInPicture2 size={16} />
                  {isPiPOpen ? "창 통합" : "창 분리"}
                </Button>
              )}

              {project && (
                <Link to={`/projects/${project.id}`}>
                  <Button variant="secondary">
                    <ExternalLink size={16} />
                    프로젝트 상세
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="relative hidden overflow-hidden lg:block">
            <img src={flodiBanner} alt="Flodi banner" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-linear-to-r from-[#12121C] via-[#12121C]/30 to-transparent" />
          </div>
        </div>
      </section>

      {activeMeeting && (
        <div className="space-y-4">
          {isCaptionsVisible && !isPiPOpen ? (
            <CaptionOverlay captions={captions} currentPartials={currentPartials} connectionStatus={connectionStatus} />
          ) : (
            <Panel>
              <div className="flex min-h-24 flex-col items-center justify-center text-center">
                <Sparkles className="mb-3 text-[#F9A8D4]" size={26} />
                <p className="text-sm font-medium text-[#F8FAFC]">{isPiPOpen ? "자막이 별도 창에 표시되고 있습니다." : "자막 보기를 켜면 실시간 발화가 표시됩니다."}</p>
                <p className="mt-2 max-w-md text-sm leading-6 text-[#CBD5E1]">회의가 진행되는 동안 이 영역은 가장 최근 발화와 말하는 사람을 중심으로 갱신됩니다.</p>
              </div>
            </Panel>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <AiAnswerPanel answers={answers} />
            <ContextSummaryPanel summary={summary} version={version} />
          </div>
        </div>
      )}

      {!activeMeeting && !isCaptionsVisible && activeMeetingQuery.isSuccess && (
        <Panel><p className="text-sm text-[#CBD5E1]">진행 중인 회의가 없습니다. 회의가 시작되면 자막 보기가 활성화됩니다.</p></Panel>
      )}

      {dashboardQuery.isLoading ? (
        <Panel><p className="text-sm text-[#CBD5E1]">채널 연결 상태를 확인하는 중입니다.</p></Panel>
      ) : dashboardQuery.isError ? (
        <EmptyState title="채널 정보를 불러오지 못했습니다" description="백엔드가 실행 중인지, VITE_API_BASE_URL이 올바른지 확인해 주세요." icon={<Cable size={18} />} />
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
                <p className="text-sm leading-6 text-[#CBD5E1]">{project.description ?? "프로젝트 설명이 아직 등록되지 않았습니다."}</p>
                <p className="text-xs text-[#CBD5E1]/70">Created {formatDateTime(project.createdAt)}</p>
              </div>
            </Panel>

            <Panel title="Recent meetings">
              <EmptyState title="최근 회의 목록 준비 중" description="프로젝트별 회의 목록 API가 연결되면 최근 회의가 이곳에 표시됩니다." icon={<MessageSquareText size={18} />} />
            </Panel>
          </div>

          <Panel title="Recent decisions">
            {recentDecisions.length ? (
              <div className="divide-y divide-[#303049]/70">
                {recentDecisions.slice(0, 6).map((decision) => (
                  <div key={decision.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#D7A86E]" size={17} />
                    <div>
                      <p className="text-sm text-[#F8FAFC]">{decision.content}</p>
                      <p className="mt-1 text-xs text-[#F2C98B]">{formatDateTime(decision.decidedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="최근 결정사항 없음" description="회의 중 저장된 결정사항이 생기면 이곳에 기록됩니다." icon={<ListChecks size={18} />} />
            )}
          </Panel>
        </>
      )}
    </div>
  );
}
