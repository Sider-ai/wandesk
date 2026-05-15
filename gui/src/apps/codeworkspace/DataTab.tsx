import { AccountTab } from "./tabs/AccountTab";
import { AgentsTab } from "./tabs/AgentsTab";
import { HistoryTab } from "./tabs/HistoryTab";
import { ListTab } from "./tabs/ListTab";
import { McpTab } from "./tabs/McpTab";
import { MemoryTab } from "./tabs/MemoryTab";
import { PlansTab } from "./tabs/PlansTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { SettingsDataTab } from "./tabs/SettingsDataTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { StatsTab } from "./tabs/StatsTab";

export function DataTab({ basePath, tabId, title, appTitle, subtitle, data, loading, onRefresh }: { basePath: string; tabId: string; title: string; appTitle: string; subtitle?: string; data: any; loading?: boolean; onRefresh?: () => void }) {
  if (tabId === "projects") return <ProjectsTab basePath={basePath} title={title} subtitle={subtitle} data={data} loading={loading} />;
  if (tabId === "memory") return <MemoryTab basePath={basePath} title={appTitle} subtitle={subtitle} data={data} loading={loading} onRefresh={onRefresh || (() => {})} />;
  if (tabId === "settings") return <SettingsDataTab basePath={basePath} data={data} loading={loading} onRefresh={onRefresh || (() => {})} />;
  if (tabId === "account") return <AccountTab basePath={basePath} data={data} loading={loading} title={appTitle} />;
  if (tabId === "stats") return <StatsTab data={data} loading={loading} />;
  if (tabId === "history") return <HistoryTab basePath={basePath} data={data} loading={loading} />;
  if (tabId === "skills") return <SkillsTab basePath={basePath} data={data} loading={loading} />;
  if (tabId === "mcp") return <McpTab basePath={basePath} data={data} loading={loading} />;
  if (tabId === "agents") return <AgentsTab data={data} loading={loading} />;
  if (tabId === "plans") return <PlansTab basePath={basePath} data={data} loading={loading} />;
  if (tabId === "plugins" || tabId === "plugin") return <ListTab title="Plugins" subtitle="Installed and marketplace plugins" data={data} loading={loading} kind="plugins" />;
  return (
    <div className="h-full overflow-y-auto px-6 py-5 cc-thin-scroll">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="text-[17px] font-bold">{title}</div>
          {subtitle && <div className="text-[11.5px] text-[#6b5a46]">{subtitle}</div>}
        </div>
        {onRefresh && <button className="rounded-md border bg-white px-2.5 py-1 text-[11px] hover:bg-[#fdf7e8]" style={{ borderColor: "rgba(140,100,60,0.18)", color: "#4a3826" }} onClick={onRefresh}>Refresh</button>}
      </div>
      {loading ? (
        <div className="text-[12px] text-[#8a7965]">Loading...</div>
      ) : !data ? (
        <div className="text-[12px] text-[#8a7965]">No data</div>
      ) : (
        <pre className="cc-mono overflow-auto rounded-xl border bg-white/80 p-3 text-[11.5px]" style={{ borderColor: "rgba(140,100,60,0.12)", color: "#2a1f13" }}>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
