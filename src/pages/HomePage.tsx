import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, PlugZap } from "lucide-react";
import { getProjectByChannel } from "../api/flodi";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { StatusPill } from "../components/ui/StatusPill";
import { useDiscordContext } from "../lib/discord/DiscordContext";

const demoChannelId = "demo-channel";

export function HomePage() {
  const discord = useDiscordContext();
  const channelId = discord.channelId ?? demoChannelId;
  const projectQuery = useQuery({
    queryKey: ["project-by-channel", channelId],
    queryFn: () => getProjectByChannel(channelId),
    enabled: Boolean(channelId),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Discord meeting dashboard"
        title="회의 흐름을 프로젝트 기억으로 연결하세요"
        description="봇은 회의의 입구와 알림을 맡고, 대시보드는 프로젝트 맥락과 결정사항을 빠르게 확인하는 작업 공간이 됩니다."
        actions={
          <Link to={`/channels/${channelId}/dashboard`}>
            <Button><PlugZap size={16} />채널 대시보드</Button>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Current entry point">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Discord button route</p>
              <p className="mt-1 text-sm text-slate-500">/channels/{channelId}/dashboard</p>
            </div>
            <StatusPill status={discord.mode === "activity" ? "Activity ready" : "Web mode"} />
          </div>
        </Panel>

        <Panel title="Backend connection">
          {projectQuery.isLoading ? (
            <p className="text-sm text-slate-500">채널 프로젝트를 확인하는 중입니다.</p>
          ) : projectQuery.isError ? (
            <EmptyState title="백엔드 연결 대기" description="Spring Boot API가 꺼져 있어도 화면은 유지됩니다. 서버 실행 후 다시 시도하세요." icon={<Bot size={18} />} />
          ) : projectQuery.data ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">{projectQuery.data.name}</p>
              <p className="text-sm text-slate-500">현재 채널과 연결된 프로젝트가 감지되었습니다.</p>
            </div>
          ) : (
            <EmptyState title="연결된 프로젝트 없음" description="Discord 봇에서 프로젝트를 만들거나 연결하면 이곳에 표시됩니다." />
          )}
        </Panel>
      </div>

      <Panel title="MVP routes">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Projects", "/projects"],
            ["Project detail", "/projects/1"],
            ["Meeting detail", "/meetings/1"],
          ].map(([label, href]) => (
            <Link key={href} to={href} className="group flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-white">
              {label}
              <ArrowRight size={15} className="text-slate-400 transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
