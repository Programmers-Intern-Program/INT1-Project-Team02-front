import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bot, PlugZap } from "lucide-react";
import { Link } from "react-router-dom";
import { getProjectByChannel } from "../api/flodi";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
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
      <PageHeader
        eyebrow="Discord meeting dashboard"
        title="Flodi dashboard"
        description="The bot stays focused on entry points and quick actions, while this dashboard carries the project and meeting workspace."
        actions={
          <Link to={`/channels/${channelId}/dashboard`}>
            <Button>
              <PlugZap size={16} />
              Channel dashboard
            </Button>
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
          </div>
        </Panel>

        <Panel title="Backend connection">
          {projectQuery.isLoading ? (
            <p className="text-sm text-slate-500">Checking the channel project.</p>
          ) : projectQuery.isError ? (
            <EmptyState
              title="Backend connection pending"
              description="The screen stays stable even when the Spring Boot API is not running. Start the backend and retry."
              icon={<Bot size={18} />}
            />
          ) : projectQuery.data ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-900">{projectQuery.data.name}</p>
              <p className="text-sm text-slate-500">A project is connected to this channel.</p>
            </div>
          ) : (
            <EmptyState
              title="No connected project"
              description="Create or connect a project from the Discord bot and it will appear here."
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
            <Link
              key={href}
              to={href}
              className="group flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-white"
            >
              {label}
              <ArrowRight size={15} className="text-slate-400 transition group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
