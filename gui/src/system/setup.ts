export type SetupStatus = {
  reachable: boolean;
  initialized?: boolean;
  welcomeSkipped?: boolean;
};

export async function getSetupStatus(): Promise<SetupStatus> {
  try {
    const res = await fetch("/api/settings/setup", { cache: "no-store" });
    if (!res.ok) return { reachable: true, initialized: true, welcomeSkipped: true };
    const data = await res.json();
    return {
      reachable: true,
      initialized: Boolean(data.initialized ?? data.ok),
      welcomeSkipped: Boolean(data.welcomeSkipped ?? data.welcome_skipped)
    };
  } catch {
    return { reachable: false };
  }
}
