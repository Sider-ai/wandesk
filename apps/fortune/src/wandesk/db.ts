// The app accesses its own database. **One of the few files actually changed for v2** —
// not a single line of app code was touched.
//
// Old version: POST /apps/<id>/db, and the host would look up the database by id.
// v2: the app is its own website, so it hits its own /api/db directly; server.js
// wires that to env.DB (D1) on the backend.
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
