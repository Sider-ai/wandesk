import { useEffect, useState } from "react";
import { api, post } from "../lib/http";
import "./Settings.css";

// 设置 —— 壳的面板,不是应用。
// 它配置的是框架本身(内核连哪个模型、系统提示词),不是任何领域的事。
// 「凡是配置框架的界面属于壳,凡是做事的一律是应用」——  这条线不含糊。
const DRIVERS = [
  { id: "responses", label: "Responses(OpenAI 及兼容网关)" },
  { id: "chat", label: "Chat Completions(GLM 等只有这个接口的服务)" },
];

export function Settings() {
  const [form, setForm] = useState({ driver: "responses", apiUrl: "", apiKey: "", model: "", system: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void api<{ settings?: Record<string, string> }>("/api/settings").then((j) => {
      const s = j.settings || {};
      setForm({
        driver: s.driver || "responses",
        apiUrl: s.apiUrl || "",
        apiKey: s.apiKey || "",   // 内核回显的是 ******** 占位符,原样回传 = 不改
        model: s.model || "",
        system: s.system || "",
      });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    await post("/api/settings", form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const field = (key: keyof typeof form, label: string, hint?: string, type = "text") => (
    <label className="set-row">
      <span className="set-label">{label}{hint && <em>{hint}</em>}</span>
      <input
        className="set-input"
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      />
    </label>
  );

  if (loading) return <div className="set-wrap"><p className="set-hint">读取中…</p></div>;

  return (
    <div className="set-wrap">
      <h2 className="set-title">模型连接</h2>
      <p className="set-hint">
        内核用它跑所有的 AI —— 应用调 <code>env.AI</code> 走的都是这一处配置。
        换供应商只换地址,不改任何应用代码。
      </p>

      <label className="set-row">
        <span className="set-label">协议驱动</span>
        <select
          className="set-input"
          value={form.driver}
          onChange={(e) => setForm((f) => ({ ...f, driver: e.target.value }))}
        >
          {DRIVERS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
      </label>

      {field("apiUrl", "接口地址", "例如 https://api.openai.com/v1/responses")}
      {field("apiKey", "API Key", "只写不读 —— 存进去就不再回显", "password")}
      {field("model", "模型 ID")}

      <label className="set-row">
        <span className="set-label">系统提示词<em>内核会在它后面追加长期记忆</em></span>
        <textarea
          className="set-input set-textarea"
          rows={5}
          value={form.system}
          onChange={(e) => setForm((f) => ({ ...f, system: e.target.value }))}
        />
      </label>

      <div className="set-actions">
        <button className="set-save" onClick={save}>保存</button>
        {saved && <span className="set-ok">已保存</span>}
      </div>
    </div>
  );
}
