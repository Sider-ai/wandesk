import { Bot } from "lucide-react";
import { ErrorBox, JsonPanel, PanelHeader, useEndpoint } from "../common";

export default function CryptoBotApp() {
  const { data, error, loading, reload } = useEndpoint<unknown>("/apps/cryptobot/api/status", []);
  return <div className="flex h-full flex-col overflow-hidden bg-[#f7f4ef]"><PanelHeader icon={<Bot className="h-4 w-4" />} title="Crypto Bot" subtitle="/apps/cryptobot/api/status" onRefresh={() => void reload()} refreshing={loading} /><ErrorBox message={error} /><JsonPanel data={data} /></div>;
}
