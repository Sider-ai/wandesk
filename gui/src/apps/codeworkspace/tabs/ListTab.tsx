import { EmptyText, GenericShell, InfoCard, JsonDetails } from "../components";

export function ListTab({ title, subtitle, data, loading, kind }: { title: string; subtitle?: string; data: any; loading?: boolean; kind?: string }) {
  const items = kind === "plugins" ? [...(data?.installed || []), ...(data?.marketplace || [])] : kind === "plans" ? data?.items || data?.plans || [] : kind === "skills" ? data?.skills || data?.items || [] : data?.configured || data?.items || data?.history || data?.agents || [];
  return (
    <GenericShell title={title} subtitle={subtitle}>
      {loading || !data ? <EmptyText text="Loading..." /> : data.error || data.available === false ? <EmptyText text={data.error || "Unavailable"} bad /> : Array.isArray(items) && items.length ? (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {items.slice(0, 80).map((item: any, index: number) => <InfoCard key={item.id || item.name || item.pluginId || item.path || index} item={item} />)}
        </div>
      ) : data.empty ? <EmptyText text="No items configured yet" /> : <JsonDetails data={data} />}
      {Array.isArray(items) && items.length > 0 && <JsonDetails data={data} />}
    </GenericShell>
  );
}
