// The app accesses its own database. **This is one of the only files changed for v2** — the app code itself is untouched.
//
// Old version: POST /apps/<id>/db, and the host looked up the database by id.
// v2: the app is its own website, hitting its own /api/db directly; the backend server.js wires it to env.DB (D1).
export type DbResult = {
  ok: boolean;
  rows?: any[];
  changes?: number;
  lastInsertRowid?: number;
  error?: string;
};

export async function db(_appId: string, sql: string, params: any[] = []): Promise<DbResult> {
  const r = await fetch("/api/db", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  return r.json();
}
