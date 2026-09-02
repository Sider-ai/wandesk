// 应用访问自己的库。**这是为 v2 唯一改过的文件之一** —— 应用代码一行没动。
//
// 旧版:POST /apps/<id>/db,由宿主按 id 找库。
// v2:应用是自己的网站,直接打自己的 /api/db;后端 server.js 把它接到 env.DB(D1)。
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
