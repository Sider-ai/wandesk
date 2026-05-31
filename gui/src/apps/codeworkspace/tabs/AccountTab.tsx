import { EmptyText, GenericShell, InfoBox, JsonDetails, StatCard } from "../components";

export function AccountTab({ basePath, data, loading, title }: { basePath: string; data: any; loading?: boolean; title: string }) {
  const isCodex = basePath.includes("codex");
  if (isCodex) {
    return (
      <GenericShell title="__T_CODEWORKSPACE_ACCOUNT_TITLE__" subtitle="__T_CODEWORKSPACE_ACCOUNT_SUBTITLE_CODEX__">
        {loading || !data ? <EmptyText text="__T_COMMON_LOADING__" /> : !data.available ? <EmptyText text={data.error || "__T_CODEWORKSPACE_UNAVAILABLE__"} bad /> : (
          <>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              <StatCard label="__T_CODEWORKSPACE_LOGIN_STATUS__" value={data.loggedIn ? "__T_CODEWORKSPACE_LOGGED_IN__" : "__T_CODEWORKSPACE_LOGGED_OUT__"} tone={data.loggedIn ? "good" : "bad"} />
              <StatCard label="__T_CODEWORKSPACE_AUTH_METHOD__" value={data.authMethod} />
              <StatCard label="__T_CODEWORKSPACE_COMMAND__" value={data.command || "codex login status"} />
            </div>
            <div className="cc-chart-card">
              <div className="cc-chart-title mb-3">__T_CODEWORKSPACE_DETAILS__</div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoBox label="__T_CODEWORKSPACE_SUMMARY__" value={data.raw} />
                <InfoBox label="__T_CODEWORKSPACE_HINT__" value={data.authMethod ? "__T_CODEWORKSPACE_AUTH_READY__" : "__T_CODEWORKSPACE_AUTH_MISSING__"} />
              </div>
            </div>
            <div className="cc-chart-card">
              <div className="cc-chart-title mb-2">__T_CODEWORKSPACE_RAW_RESPONSE__</div>
              <pre className="cc-mono overflow-x-auto whitespace-pre-wrap rounded-md p-3 text-[11.5px]" style={{ background: "#1f1a12", color: "#e8d8a8" }}>{data.raw}</pre>
            </div>
          </>
        )}
      </GenericShell>
    );
  }
  return (
    <GenericShell title="__T_CODEWORKSPACE_ACCOUNT_TITLE__" subtitle={`__T_CODEWORKSPACE_ACCOUNT_SUBTITLE_PREFIX__${title}__T_CODEWORKSPACE_ACCOUNT_SUBTITLE_SUFFIX__`}>
      {loading || !data ? <EmptyText text="__T_COMMON_LOADING__" /> : !data.available ? <EmptyText text={data.error || "__T_CODEWORKSPACE_UNAVAILABLE__"} bad /> : (
        <>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard label="__T_CODEWORKSPACE_LOGIN_STATUS__" value={data.loggedIn ? "__T_CODEWORKSPACE_LOGGED_IN__" : "__T_CODEWORKSPACE_LOGGED_OUT__"} tone={data.loggedIn ? "good" : "bad"} />
            <StatCard label="__T_CODEWORKSPACE_AUTH_METHOD__" value={data.authMethod} />
            <StatCard label="__T_CODEWORKSPACE_PROVIDER__" value={data.apiProvider} />
            <StatCard label="__T_CODEWORKSPACE_SUBSCRIPTION__" value={data.subscriptionType} />
          </div>
          <div className="cc-chart-card">
            <div className="cc-chart-title mb-3">__T_CODEWORKSPACE_ACCOUNT_DETAILS__</div>
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
