import { useEffect, useMemo, useState } from "react";
import { buildTakeoverPrompt, resolveTakeoverGuidePath } from "../../system/takeoverGuide";

type Variant = "light" | "brass" | "dark";

const PROMPT_TEMPLATE = "__T_AGENT_GUIDE_PROMPT__";
const PATH_FALLBACK = "__T_AGENT_GUIDE_PATH_FALLBACK__";

const styles = {
  light: {
    box: {
      background: "linear-gradient(180deg,#fffaf0,#efe1c2 62%,#dfc293)",
      border: "1px solid rgba(92,67,50,0.18)",
      color: "#2a1f13",
      boxShadow: "0 12px 28px rgba(92,67,50,0.14),inset 0 1px 0 rgba(255,255,245,0.8)"
    },
    sub: "rgba(61,47,30,0.62)",
    prompt: {
      background: "rgba(70,46,20,0.08)",
      border: "1px solid rgba(92,67,50,0.13)",
      color: "#2a1f13"
    },
    button: {
      background: "linear-gradient(180deg,#5c4332,#3c291c)",
      color: "#fff6e8",
      border: "1px solid rgba(36,24,14,0.7)",
      boxShadow: "0 2px 0 rgba(0,0,0,0.22),inset 0 1px 0 rgba(255,255,255,0.15)"
    }
  },
  brass: {
    box: {
      background: "linear-gradient(180deg,#f8efd8,#ead8b4 58%,#dec398)",
      border: "1px solid rgba(70,40,10,0.32)",
      color: "#3a2810",
      boxShadow: "0 2px 0 rgba(80,48,14,0.22),0 10px 22px rgba(30,18,8,0.24),inset 0 1px 0 rgba(255,250,220,0.72)"
    },
    sub: "#7d6540",
    prompt: {
      background: "rgba(63,39,14,0.1)",
      border: "1px solid rgba(122,82,28,0.18)",
      color: "#3a2810"
    },
    button: {
      background: "linear-gradient(180deg,#d9bd70,#b38d35 54%,#8f681e)",
      color: "#321d08",
      border: "1px solid #6d4a14",
      boxShadow: "0 2px 0 rgba(46,24,0,0.5),inset 0 1px 1px rgba(255,245,190,0.42)"
    }
  },
  dark: {
    box: {
      background: "linear-gradient(180deg,#fff3d8,#ead2a5 62%,#d7b97f)",
      border: "1px solid rgba(62,37,10,0.34)",
      color: "#2b1a08",
      boxShadow: "0 14px 28px rgba(0,0,0,0.26),0 2px 0 rgba(0,0,0,0.28),inset 0 1px 0 rgba(255,255,232,0.7)"
    },
    sub: "#7a603a",
    prompt: {
      background: "rgba(70,43,12,0.09)",
      border: "1px solid rgba(106,70,18,0.16)",
      color: "#2b1a08"
    },
    button: {
      background: "linear-gradient(180deg,#ffe0a0,#d4ad54 48%,#8c6124)",
      color: "#231506",
      border: "1px solid rgba(51,31,8,0.88)",
      boxShadow: "0 2px 0 rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,251,214,0.55)"
    }
  }
};

export default function AgentGuideCard({
  agentName,
  variant = "light",
  compact = false
}: {
  agentName: string;
  variant?: Variant;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [guidePath, setGuidePath] = useState("");
  const s = styles[variant];
  const prompt = useMemo(() => buildTakeoverPrompt(PROMPT_TEMPLATE, PATH_FALLBACK, guidePath), [guidePath]);

  useEffect(() => {
    let mounted = true;
    resolveTakeoverGuidePath()
      .then((path) => {
        if (mounted) setGuidePath(path);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={`rounded-md ${compact ? "p-3" : "p-4"}`} style={s.box}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold tracking-[0.08em]" style={{ color: s.sub }}>__T_AGENT_GUIDE_LABEL__</div>
          <div className="mt-1 text-[15px] font-bold leading-tight">{agentName}</div>
        </div>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 cursor-pointer rounded px-3 py-1.5 text-[10px] font-bold transition-transform active:translate-y-0.5"
          style={s.button}
        >
          {copied ? "__T_AGENT_GUIDE_COPIED__" : "__T_AGENT_GUIDE_COPY__"}
        </button>
      </div>
      <p className="mb-2 text-[11.5px] leading-relaxed" style={{ color: s.sub }}>__T_AGENT_GUIDE_DESC__</p>
      <div className="mb-2 rounded-sm px-2.5 py-1.5 text-[10px] leading-relaxed" style={s.prompt}>
        <span className="font-bold" style={{ color: s.sub }}>__T_AGENT_GUIDE_PATH_LABEL__</span>
        <span className="ml-1 select-all font-mono">{guidePath || PATH_FALLBACK}</span>
      </div>
      <div className="mb-1 text-[9px] font-bold tracking-[0.08em]" style={{ color: s.sub }}>__T_AGENT_GUIDE_PROMPT_HINT__</div>
      <div className={`${compact ? "line-clamp-4" : "max-h-[160px] overflow-y-auto"} select-all whitespace-pre-wrap rounded-sm px-3 py-2 font-mono text-[10.5px] leading-relaxed [overflow-wrap:anywhere]`} style={s.prompt}>
        {prompt}
      </div>
    </section>
  );
}
