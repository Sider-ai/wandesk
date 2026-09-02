// App-side access to its own database. **One of the only files changed for v2** —
// the app code itself didn't change a line.
//
// Old version: POST /apps/<id>/db, host looks up the database by id.
// v2: the app is its own website, hits its own /api/db directly; server.js wires it to env.DB (D1).
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
