import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bot, PlugZap } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjectByChannel } from "../api/flodi";
import flodiBanner from "../assets/flodi-banner.png";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Panel } from "../components/ui/Panel";

const demoChannelId = "demo-channel";

export function HomePage() {
  const channelId = demoChannelId;
  const projectQuery = useQuery({
    queryKey: ["project-by-channel", channelId],
    queryFn: () => getProjectByChannel(channelId),
  });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-[#303049] bg-[#12121C] shadow-[0_18px_48px_rgba(0,0,0,0.36)]">
        <div className="grid min-h-56 lg:grid-cols-2">
          <div className="flex flex-col justify-end px-6 py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C4B5FD]">Discord meeting dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#F8FAFC]">Flodi dashboard</h1>
            <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">
              Discord 회의의 자막, AI 응답, 프로젝트 기록을 이어서 확인하는 작업 공간입니다.
            </p>
            <div className="mt-5">
              <Link to={`/channels/${channelId}/dashboard`}>
                <Button className="border-[#A78BFA] bg-linear-to-r from-[#8B5CF6] via-[#A78BFA] to-[#F9A8D4] text-white shadow-[0_0_24px_rgba(167,139,250,0.32)] hover:border-[#F9A8D4] hover:from-[#A78BFA] hover:via-[#C4B5FD] hover:to-[#F9A8D4]">
                  <PlugZap size={16} />
                  채널 대시보드
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative hidden overflow-hidden lg:block">
            <img src={flodiBanner} alt="Flodi banner" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-linear-to-r from-[#12121C] via-[#12121C]/30 to-transparent" />
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Current entry point">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-[#F8FAFC]">Discord button route</p>
                <p className="mt-1 text-sm text-[#CBD5E1]">/channels/{channelId}/dashboard</p>
              </div>
            </div>
          </Panel>

          <Panel title="Backend connection">
            {projectQuery.isLoading ? (
              <p className="text-sm text-[#CBD5E1]">채널 프로젝트를 확인하는 중입니다.</p>
            ) : projectQuery.isError ? (
              <EmptyState
                title="백엔드 연결 대기 중"
                description="Spring Boot API가 실행되지 않아도 화면은 유지됩니다. 백엔드를 시작한 뒤 다시 확인해 주세요."
                icon={<Bot size={18} />}
              />
            ) : projectQuery.data ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#F8FAFC]">{projectQuery.data.name}</p>
                <p className="text-sm text-[#CBD5E1]">이 채널에 프로젝트가 연결되어 있습니다.</p>
              </div>
            ) : (
              <EmptyState
                title="연결된 프로젝트가 없습니다"
                description="Discord 봇에서 프로젝트를 만들거나 연결하면 이곳에 표시됩니다."
              />
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
              <Link key={href} to={href} className="group flex items-center justify-between rounded-md border border-[#303049] bg-[#1B1B2A] px-4 py-3 text-sm font-medium text-[#F8FAFC] transition hover:bg-[#24243A]">
                {label}
                <ArrowRight size={15} className="text-[#CBD5E1] transition group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
