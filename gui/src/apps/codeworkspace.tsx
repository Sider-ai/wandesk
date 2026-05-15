import { useEffect, useState } from "react";
import { ChatPane } from "./codeworkspace/ChatPane";
import { DataTab } from "./codeworkspace/DataTab";
import type { CodeWorkspaceProps } from "./codeworkspace/types";
import { fetchJson } from "./codeworkspace/utils";

export default function CodeWorkspace(props: CodeWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("chat");
  const [cliStatus, setCliStatus] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [dataMap, setDataMap] = useState<Record<string, any>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const fetchStatus = async () => {
    setCheckingStatus(true);
    try {
      setCliStatus(await fetchJson(`${props.basePath}/status`));
    } catch {
      setCliStatus({ installed: false });
    } finally {
      setCheckingStatus(false);
    }
  };

  const loadTab = async (tab: string) => {
    if (tab === "chat") return;
    setLoadingMap((prev) => ({ ...prev, [tab]: true }));
    try {
      const suffix = tab === "projects" ? "projects" : tab;
      const query = tab === "history" ? "?limit=300" : "";
      const data = await fetchJson(`${props.basePath}/${suffix}${query}`);
      setDataMap((prev) => ({ ...prev, [tab]: data }));
    } catch (err) {
      setDataMap((prev) => ({ ...prev, [tab]: { error: (err as Error).message } }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [tab]: false }));
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [props.basePath]);

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab, props.basePath]);

  if (cliStatus && !cliStatus.installed) {
    return (
      <div className="cc-app-root relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#faf6ec]">
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <div className="text-[38px]">{props.emptyIcon}</div>
          <div className="text-[18px] font-bold text-[#2a1f13]">{props.title} CLI not installed</div>
          <div className="max-w-[360px] text-[12.5px] leading-relaxed text-[#6b5a46]">{cliStatus.error || "Install and configure the CLI, then recheck status."}</div>
          <button className="rounded-lg border bg-white px-4 py-2 text-[12px] font-semibold text-[#5c4332] hover:bg-[#fffaf2]" disabled={checkingStatus} onClick={fetchStatus}>{checkingStatus ? "Checking..." : "Recheck"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cc-app-root relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#faf6ec]">
      <div className="flex h-[38px] shrink-0 items-stretch overflow-x-auto overflow-y-hidden border-b px-2.5" style={{ borderColor: "rgba(140,100,60,0.12)", background: "#fffaf2" }}>
        {props.tabs.map((tab) => (
          <button key={tab.id} className={`cc-tab-btn ${activeTab === tab.id ? "cc-tab-active" : ""}`} onClick={() => setActiveTab(tab.id)}>
            <span>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {activeTab === "chat" ? (
          <ChatPane basePath={props.basePath} title={props.title} emptyIcon={props.emptyIcon} installed={Boolean(cliStatus?.installed)} defaultPermissionMode={props.defaultPermissionMode} permissionModes={props.permissionModes} />
        ) : (
          <DataTab basePath={props.basePath} tabId={activeTab} title={props.tabs.find((tab) => tab.id === activeTab)?.label || activeTab} appTitle={props.title} subtitle={activeTab === "memory" ? props.memoryLabel : activeTab === "projects" ? props.projectLabel : undefined} data={dataMap[activeTab]} loading={loadingMap[activeTab]} onRefresh={() => loadTab(activeTab)} />
        )}
      </div>
    </div>
  );
}
