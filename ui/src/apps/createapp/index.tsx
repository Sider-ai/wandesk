import {
  AlarmClock,
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  CookingPot,
  Drama,
  Gamepad2,
  KanbanSquare,
  KeyRound,
  Layers3,
  Leaf,
  Map,
  Package,
  Palette,
  PanelsTopLeft,
  PenLine,
  ReceiptText,
  Regex,
  Sparkles,
  Swords,
  Timer,
  UsersRound,
  Wrench,
  Zap
} from "lucide-react";
import type { ComponentType } from "react";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import ChatApp from "../chat";
import { windowManager } from "../../system/windows";

type Template = {
  cat: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  name: string;
  desc: string;
};

const categories = [
  { key: "all", icon: Layers3, label: "__T_CREATEAPP_CAT_ALL__", color: "#334155" },
  { key: "ai", icon: Brain, label: "__T_CREATEAPP_CAT_AI__", color: "#4f46e5" },
  { key: "tool", icon: Wrench, label: "__T_CREATEAPP_CAT_TOOL__", color: "#0369a1" },
  { key: "game", icon: Gamepad2, label: "__T_CREATEAPP_CAT_GAME__", color: "#7c3aed" },
  { key: "life", icon: Leaf, label: "__T_CREATEAPP_CAT_LIFE__", color: "#15803d" },
  { key: "business", icon: BriefcaseBusiness, label: "__T_CREATEAPP_CAT_BUSINESS__", color: "#b45309" },
  { key: "productivity", icon: Zap, label: "__T_CREATEAPP_CAT_PRODUCTIVITY__", color: "#0e7490" }
];

const templates: Template[] = [
  { cat: "ai", icon: ChartNoAxesCombined, name: "__T_CREATEAPP_TPL_COMPETITOR_NAME__", desc: "__T_CREATEAPP_TPL_COMPETITOR_DESC__" },
  { cat: "ai", icon: PenLine, name: "__T_CREATEAPP_TPL_MARKETING_NAME__", desc: "__T_CREATEAPP_TPL_MARKETING_DESC__" },
  { cat: "ai", icon: ClipboardList, name: "__T_CREATEAPP_TPL_PROPOSAL_NAME__", desc: "__T_CREATEAPP_TPL_PROPOSAL_DESC__" },
  { cat: "ai", icon: UsersRound, name: "__T_CREATEAPP_TPL_INTERVIEW_NAME__", desc: "__T_CREATEAPP_TPL_INTERVIEW_DESC__" },
  { cat: "ai", icon: Map, name: "__T_CREATEAPP_TPL_MINDMAP_NAME__", desc: "__T_CREATEAPP_TPL_MINDMAP_DESC__" },
  { cat: "ai", icon: Drama, name: "__T_CREATEAPP_TPL_PERSONA_NAME__", desc: "__T_CREATEAPP_TPL_PERSONA_DESC__" },
  { cat: "tool", icon: KeyRound, name: "__T_CREATEAPP_TPL_PASSWORD_NAME__", desc: "__T_CREATEAPP_TPL_PASSWORD_DESC__" },
  { cat: "tool", icon: Palette, name: "__T_CREATEAPP_TPL_COLOR_NAME__", desc: "__T_CREATEAPP_TPL_COLOR_DESC__" },
  { cat: "tool", icon: Regex, name: "__T_CREATEAPP_TPL_REGEX_NAME__", desc: "__T_CREATEAPP_TPL_REGEX_DESC__" },
  { cat: "game", icon: Gamepad2, name: "__T_CREATEAPP_TPL_SNAKE_NAME__", desc: "__T_CREATEAPP_TPL_SNAKE_DESC__" },
  { cat: "game", icon: PanelsTopLeft, name: "__T_CREATEAPP_TPL_MEMORY_NAME__", desc: "__T_CREATEAPP_TPL_MEMORY_DESC__" },
  { cat: "game", icon: Swords, name: "__T_CREATEAPP_TPL_ADVENTURE_NAME__", desc: "__T_CREATEAPP_TPL_ADVENTURE_DESC__" },
  { cat: "life", icon: CookingPot, name: "__T_CREATEAPP_TPL_RECIPE_NAME__", desc: "__T_CREATEAPP_TPL_RECIPE_DESC__" },
  { cat: "life", icon: Timer, name: "__T_CREATEAPP_TPL_COUNTDOWN_NAME__", desc: "__T_CREATEAPP_TPL_COUNTDOWN_DESC__" },
  { cat: "business", icon: Package, name: "__T_CREATEAPP_TPL_INVENTORY_NAME__", desc: "__T_CREATEAPP_TPL_INVENTORY_DESC__" },
  { cat: "business", icon: ReceiptText, name: "__T_CREATEAPP_TPL_QUOTE_NAME__", desc: "__T_CREATEAPP_TPL_QUOTE_DESC__" },
  { cat: "business", icon: UsersRound, name: "__T_CREATEAPP_TPL_FOLLOWUP_NAME__", desc: "__T_CREATEAPP_TPL_FOLLOWUP_DESC__" },
  { cat: "productivity", icon: CalendarDays, name: "__T_CREATEAPP_TPL_PLANNER_NAME__", desc: "__T_CREATEAPP_TPL_PLANNER_DESC__" },
  { cat: "productivity", icon: KanbanSquare, name: "__T_CREATEAPP_TPL_BOARD_NAME__", desc: "__T_CREATEAPP_TPL_BOARD_DESC__" },
  { cat: "productivity", icon: AlarmClock, name: "__T_CREATEAPP_TPL_POMODORO_NAME__", desc: "__T_CREATEAPP_TPL_POMODORO_DESC__" }
];

const categoryColor = (key: string) => categories.find((cat) => cat.key === key)?.color || "#2563eb";

export default function CreateAppApp() {
  const [prompt, setPrompt] = useState("");
  const [composing, setComposing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTpl, setSelectedTpl] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => activeCategory === "all" ? templates : templates.filter((item) => item.cat === activeCategory), [activeCategory]);
  const selectedTemplate = useMemo(() => templates.find((item) => item.name === selectedTpl) || null, [selectedTpl]);
  const boardAccent = selectedTemplate ? categoryColor(selectedTemplate.cat) : "#9b6a35";

  const selectTemplate = (template: Template) => {
    setPrompt(template.desc);
    setSelectedTpl(template.name);
  };

  const create = async () => {
    const message = prompt.trim();
    if (!message || composing) return;
    await windowManager.openComponent({
      key: "chat",
      appId: "chat",
      title: "__T_CREATEAPP_CHAT_WINDOW_TITLE__",
      icon: "💬",
      component: ChatApp,
      defaultDesktopWindowSize: { w: 900, h: 640 },
      singleton: true,
      props: {
        id: null,
        pendingMessage: null,
        intentRequest: {
          requestId: `createapp-${Date.now()}`,
          intent: "new_and_send",
          payload: { message }
        }
      }
    });
    setPrompt("");
    setSelectedTpl(null);
  };

  return (
    <div className="createapp-shell flex h-full flex-col text-[#18242f]">
      <div className="createapp-top shrink-0 px-7 pb-5 pt-7">
        <div className="mx-auto max-w-[700px]">
          <div className="createapp-masthead flex items-start gap-3.5">
            <div className="createapp-emblem flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] text-[#fff8e9]">
              <Sparkles className="h-[17px] w-[17px]" strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[24px] font-semibold leading-tight text-[#2b2117]">{ "__T_CREATEAPP_HEADING__" }</h2>
              <p className="mt-1 text-[13px] leading-[1.55] text-[#756452]">{ "__T_CREATEAPP_SUBTITLE__" }</p>
            </div>
          </div>
          <div className={`prompt-box createapp-board relative mt-5 ${selectedTemplate ? "has-template" : ""}`} style={{ "--accent": boardAccent } as CSSProperties}>
            <span className="createapp-board-clip" />
            <span className="createapp-board-pin createapp-board-pin-left" />
            <span className="createapp-board-pin createapp-board-pin-right" />
            <textarea
              value={prompt}
              rows={3}
              className="prompt-input w-full resize-none border px-5 py-4 pr-[128px] text-[13.5px] leading-[1.65] text-[#2b2117] outline-none transition placeholder:text-[#a39482]"
              placeholder="__T_CREATEAPP_INPUT_PLACEHOLDER__"
              onChange={(event) => setPrompt(event.target.value)}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={() => setComposing(false)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  create();
                }
              }}
            />
            {selectedTemplate && (
              <span className="createapp-template-tag absolute left-5 top-3 inline-flex max-w-[calc(100%-170px)] items-center gap-1.5 truncate px-2 py-1 text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" />
                <span className="truncate">{selectedTemplate.name}</span>
              </span>
            )}
            <button className="create-button absolute bottom-3.5 right-3.5 inline-flex h-8 items-center gap-1.5 px-3.5 text-[12px] font-semibold text-[#fff7e7] transition disabled:cursor-not-allowed disabled:opacity-40" disabled={!prompt.trim() || composing} onClick={create}>
              { "__T_CREATEAPP_CREATE_BUTTON__" } <ArrowRight className="h-[13px] w-[13px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-7 pb-3">
        <div className="category-group mx-auto flex max-w-[700px] flex-wrap gap-1.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button key={cat.key} className={`category-button inline-flex items-center gap-1.5 border px-2.5 py-[5px] text-[11.5px] font-semibold transition ${activeCategory === cat.key ? "is-active" : ""}`} style={{ "--accent": cat.color } as CSSProperties} onClick={() => setActiveCategory(cat.key)}>
                <span className="category-mark"><Icon className="h-[12px] w-[12px]" strokeWidth={2} /></span>{cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-8 pt-1 [scrollbar-width:thin]">
        <div className="mx-auto grid max-w-[700px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button key={template.name} className={`template-card group relative flex min-h-[124px] flex-col border px-3.5 pb-3.5 pt-3 text-left transition ${selectedTpl === template.name ? "is-selected" : ""}`} style={{ "--accent": categoryColor(template.cat) } as CSSProperties} onClick={() => selectTemplate(template)}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="template-icon flex h-8 w-8 shrink-0 items-center justify-center"><Icon className="h-[16px] w-[16px]" strokeWidth={1.9} /></span>
                  <span className="min-w-0 truncate text-[13px] font-semibold text-[#2c241a]">{template.name}</span>
                </div>
                <p className="line-clamp-3 text-[11.5px] leading-[1.62] text-[#766857]">{template.desc}</p>
              </button>
            );
          })}
        </div>
        {!filteredTemplates.length && <div className="py-10 text-center text-[12.5px] text-[#8b99a7]">{ "__T_CREATEAPP_EMPTY_STATE__" }</div>}
      </div>
    </div>
  );
}
