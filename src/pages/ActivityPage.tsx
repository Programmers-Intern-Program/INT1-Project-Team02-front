import { LoaderCircle, Radio } from "lucide-react";
import { Navigate, useSearchParams } from "react-router-dom";
import { apiBaseUrl } from "../api/client";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Panel } from "../components/ui/Panel";
import { StatusPill } from "../components/ui/StatusPill";
import { useDiscordContext } from "../lib/discord/DiscordContext";

export function ActivityPage() {
  const discord = useDiscordContext();
  const [searchParams] = useSearchParams();
  const debug = searchParams.get("debug") === "1";

  if (!debug && discord.sdkStatus === "ready" && discord.channelId) {
    return <Navigate to={`/channels/${discord.channelId}/dashboard?discord_activity=1`} replace />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Discord Activity"
        title="Flodi Activity"
        description="Discord iframe 안에서 SDK 연결 상태와 채널 컨텍스트를 확인합니다."
        actions={<StatusPill status={discord.sdkStatus} />}
      />

      {discord.sdkStatus === "loading" && (
        <Panel>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <LoaderCircle className="animate-spin" size={18} />
            Discord SDK를 준비하는 중입니다.
          </div>
        </Panel>
      )}

      {discord.sdkStatus === "idle" && (
        <Panel>
          <p className="text-sm text-slate-500">
            일반 웹 모드입니다. Discord Activity iframe 안에서 실행해주세요.
          </p>
        </Panel>
      )}

      {discord.sdkStatus === "error" && (
        <EmptyState
          title="Discord Activity를 초기화하지 못했습니다"
          description={discord.sdkError ?? "Discord Developer Portal 설정과 VITE_DISCORD_CLIENT_ID를 확인해주세요."}
          icon={<Radio size={18} />}
        />
      )}

      {discord.sdkStatus === "ready" && !discord.channelId && (
        <EmptyState
          title="현재 Discord 채널 정보를 가져올 수 없습니다"
          description="Voice 채널 외부, DM, SDK context 지연, 권한 제한 상황에서는 channel_id가 비어 있을 수 있습니다."
          icon={<Radio size={18} />}
        />
      )}

      <Panel title="Activity context">
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-slate-500">Mode</dt>
            <dd className="font-medium text-slate-800">{discord.mode}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-slate-500">Embedded</dt>
            <dd className="font-medium text-slate-800">{discord.isEmbedded ? "yes" : "no"}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-slate-500">Guild</dt>
            <dd className="font-medium text-slate-800">{discord.serverId ?? "none"}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-slate-500">Channel</dt>
            <dd className="font-medium text-slate-800">{discord.channelId ?? "none"}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-slate-500">User</dt>
            <dd className="font-medium text-slate-800">{discord.userId ?? "none"}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-slate-500">API base</dt>
            <dd className="font-medium text-slate-800">{apiBaseUrl}</dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <dt className="text-slate-500">Debug</dt>
            <dd className="font-medium text-slate-800">{debug ? "on" : "off"}</dd>
          </div>
        </dl>
      </Panel>
    </div>
  );
}
