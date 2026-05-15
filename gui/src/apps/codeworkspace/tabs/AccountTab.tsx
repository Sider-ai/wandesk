import { EmptyText, GenericShell, InfoBox, JsonDetails, StatCard } from "../components";

export function AccountTab({ basePath, data, loading, title }: { basePath: string; data: any; loading?: boolean; title: string }) {
  const isCodex = basePath.includes("codex");
  if (isCodex) {
    return (
      <GenericShell title="Account" subtitle="Data from codex login status">
        {loading || !data ? <EmptyText text="Loading..." /> : !data.available ? <EmptyText text={data.error || "Unavailable"} bad /> : (
          <>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              <StatCard label="Login Status" value={data.loggedIn ? "Logged In" : "Logged Out"} tone={data.loggedIn ? "good" : "bad"} />
              <StatCard label="Auth Method" value={data.authMethod} />
              <StatCard label="Command" value={data.command || "codex login status"} />
            </div>
            <div className="cc-chart-card">
              <div className="cc-chart-title mb-3">Details</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoBox label="Summary" value={data.raw} />
                <InfoBox label="Hint" value={data.authMethod ? "The CLI is already authenticated and ready to start sessions." : "The CLI is not authenticated yet. Complete login in your terminal first."} />
              </div>
            </div>
            <div className="cc-chart-card">
              <div className="cc-chart-title mb-2">Raw Response</div>
              <pre className="cc-mono overflow-x-auto whitespace-pre-wrap rounded-md p-3 text-[11.5px]" style={{ background: "#1f1a12", color: "#e8d8a8" }}>{data.raw}</pre>
            </div>
          </>
        )}
      </GenericShell>
    );
  }
  return (
    <GenericShell title="Account" subtitle={`Data from ${title} auth status`}>
      {loading || !data ? <EmptyText text="Loading..." /> : !data.available ? <EmptyText text={data.error || "Unavailable"} bad /> : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard label="Login Status" value={data.loggedIn ? "Logged In" : "Logged Out"} tone={data.loggedIn ? "good" : "bad"} />
            <StatCard label="Auth Method" value={data.authMethod} />
            <StatCard label="Provider" value={data.apiProvider} />
            <StatCard label="Subscription" value={data.subscriptionType} />
          </div>
          <div className="cc-chart-card">
            <div className="cc-chart-title mb-3">Account Details</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {["email", "orgName", "orgId"].map((key) => <InfoBox key={key} label={key} value={data[key]} />)}
            </div>
          </div>
          <JsonDetails data={data} />
        </>
      )}
    </GenericShell>
  );
}
