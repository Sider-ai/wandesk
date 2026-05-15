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
  { key: "all", icon: Layers3, label: "All", color: "#334155" },
  { key: "ai", icon: Brain, label: "AI-Powered", color: "#4f46e5" },
  { key: "tool", icon: Wrench, label: "Tools", color: "#0369a1" },
  { key: "game", icon: Gamepad2, label: "Games", color: "#7c3aed" },
  { key: "life", icon: Leaf, label: "Life", color: "#15803d" },
  { key: "business", icon: BriefcaseBusiness, label: "Business", color: "#b45309" },
  { key: "productivity", icon: Zap, label: "Productivity", color: "#0e7490" }
];

const templates: Template[] = [
  { cat: "ai", icon: ChartNoAxesCombined, name: "Competitor Analysis", desc: "Create a competitor analysis app that supports entering multiple competitor names, product positioning, pricing, core features, and target users, then automatically generates comparison tables, strengths and weaknesses summaries, differentiation suggestions, and actionable go-to-market angles. The interface should be clear and suitable for strategy work." },
  { cat: "ai", icon: PenLine, name: "Marketing Copy", desc: "Create an AI copywriting workspace that accepts product details, target users, publishing channels, and tone of voice, then generates headlines, short copy, long copy, selling-point summaries, and multiple rewrite variants. It should also support favorites, copy, and template switching by scenario." },
  { cat: "ai", icon: ClipboardList, name: "Proposal Generator", desc: "Create a proposal generation app that accepts client background, project goals, budget range, timeline, and execution plan, then organizes them into a structured proposal including project overview, deliverables, schedule, pricing notes, and risk reminders." },
  { cat: "ai", icon: UsersRound, name: "Mock Interview", desc: "Create an interview assistant app that supports role descriptions, candidate resumes, interview stages, and focus areas, then automatically generates interview questions, follow-up suggestions, scoring dimensions, candidate evaluation notes, and a final conclusion for hiring workflows." },
  { cat: "ai", icon: Map, name: "Mind Map", desc: "Create a mind map app that can break down a topic into subtopics, key questions, action suggestions, and hierarchy after the user enters a theme. It should support card or tree views, manual node editing, collapse and expand, and outline export." },
  { cat: "ai", icon: Drama, name: "User Persona", desc: "Create a persona builder app that generates character cards from user segment, age, occupation, spending power, needs, and pain points, including typical scenarios, behavior patterns, decision factors, common objections, and product opportunity areas." },
  { cat: "tool", icon: KeyRound, name: "Password Generator", desc: "Create a password utility app that supports high-strength password generation, batch generation, custom length and character rules, password strength scoring, template switching, and one-click copy. The interface should feel simple, secure, and efficient." },
  { cat: "tool", icon: Palette, name: "Color Studio", desc: "Create a color tool app that generates palettes from a primary color, including complementary colors, analogous colors, gradients, light and dark scales, and real UI usage examples for buttons, backgrounds, and text. It should support one-click copy for HEX and RGB values." },
  { cat: "tool", icon: Regex, name: "Regex Debugger", desc: "Create a regular expression tool app that supports real-time matching against input text and rules, displays matched results, highlighted fragments, group information, and common rule examples, and includes a test area, explanation area, and error states." },
  { cat: "game", icon: Gamepad2, name: "Snake", desc: "Create a Snake game with keyboard controls, scoring, increasing speed, restart, pause, and basic mobile adaptation. The overall style should feel a bit retro rather than generic, and the controls and animation should be smooth." },
  { cat: "game", icon: PanelsTopLeft, name: "Memory Match", desc: "Create a memory card game with multiple difficulty levels, a timer, move counts, completion results, and restart support. The cards should look playful, the flip animation should be clear, and the game should suit a light casual scenario." },
  { cat: "game", icon: Swords, name: "Text Adventure", desc: "Create a text adventure game with character status, branching storylines, item collection, dialogue progression, and key choices. The interface should feel atmospheric so the user feels like they are inside an interactive novel rather than a plain form." },
  { cat: "life", icon: CookingPot, name: "Recipe Finder", desc: "Create a recipe app that supports filtering by ingredients, flavor, and cooking style, displays steps, prep time, difficulty, quantity lists, and favorites, and also allows users to save their own recipes." },
  { cat: "life", icon: Timer, name: "Countdown", desc: "Create a countdown app that supports multiple event cards, target date settings, remaining time display, progress bars, reminder copy, and categories for important dates such as birthdays, travel, exams, and project deadlines." },
  { cat: "business", icon: Package, name: "Inventory Manager", desc: "Create an inventory management app that supports product lists, categories, SKUs, stock in and out, current inventory, stock alerts, supplier info, and search and filtering. It should include clear data tables and smooth create and edit flows." },
  { cat: "business", icon: ReceiptText, name: "Quote Generator", desc: "Create a quotation app that supports customer info, project name, line items, quantity, tax rate, notes, and validity period, then automatically calculates totals and generates a professional quotation sheet for business communication and pricing." },
  { cat: "business", icon: UsersRound, name: "Customer Follow-up Board", desc: "Create a customer follow-up app that supports customer profiles, source channels, follow-up stages, owners, next contact times, follow-up notes, and deal status, suitable for day-to-day sales or consulting workflows." },
  { cat: "productivity", icon: CalendarDays, name: "Planner Calendar", desc: "Create a planning calendar app that supports day, week, and month views, priority, color tags, reminder times, completion states, and quick create and edit. The overall experience should feel lightweight and efficient." },
  { cat: "productivity", icon: KanbanSquare, name: "Project Board", desc: "Create a project board app with To Do, In Progress, and Done columns, drag-and-drop cards, owners, due dates, labels, and a task detail panel, suitable for personal use or small team project management." },
  { cat: "productivity", icon: AlarmClock, name: "Pomodoro Focus", desc: "Create a Pomodoro timer app with focus sessions, short breaks, and long breaks, showing today's focus count, total duration, focus history, and reminder status. The interface should feel calm and restrained for long-term use." }
];

const categoryColor = (key: string) => categories.find((cat) => cat.key === key)?.color || "#2563eb";

export default function CreateAppApp() {
  const [prompt, setPrompt] = useState("");
  const [composing, setComposing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTpl, setSelectedTpl] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => activeCategory === "all" ? templates : templates.filter((item) => item.cat === activeCategory), [activeCategory]);

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
      title: "Chat",
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
      <div className="shrink-0 px-7 pb-5 pt-7">
        <div className="mx-auto max-w-[640px]">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#102033] text-white shadow-[0_8px_22px_rgba(16,32,51,0.18)]">
              <Sparkles className="h-[17px] w-[17px]" strokeWidth={1.9} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[24px] font-semibold leading-tight text-[#102033]">Create New App</h2>
              <p className="mt-1 text-[13px] leading-[1.55] text-[#607080]">Describe your idea and AI will build it</p>
            </div>
          </div>
        </div>
        <div className="prompt-box relative mx-auto mt-5 max-w-[640px]">
          <textarea
            value={prompt}
            rows={3}
            className="prompt-input w-full resize-none border bg-white px-4 py-3.5 pr-[120px] text-[13.5px] leading-[1.65] text-[#17212b] outline-none transition placeholder:text-[#9aa7b4]"
            placeholder="Describe the app you want..."
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
          <button className="create-button absolute bottom-3 right-3 inline-flex h-8 items-center gap-1.5 px-3.5 text-[12px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-35" disabled={!prompt.trim() || composing} onClick={create}>
            Create <ArrowRight className="h-[13px] w-[13px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="shrink-0 px-7 pb-3">
        <div className="category-group mx-auto flex max-w-[640px] flex-wrap gap-1.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button key={cat.key} className={`category-button inline-flex items-center gap-1.5 border px-2.5 py-[5px] text-[11.5px] font-medium transition ${activeCategory === cat.key ? "is-active" : ""}`} style={{ "--accent": cat.color } as CSSProperties} onClick={() => setActiveCategory(cat.key)}>
                <span className="category-mark"><Icon className="h-[12px] w-[12px]" strokeWidth={2} /></span>{cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-7 pb-8 pt-1 [scrollbar-width:thin]">
        <div className="mx-auto grid max-w-[640px] grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <button key={template.name} className={`template-card group relative flex min-h-[116px] flex-col border bg-white px-3.5 pb-3.5 pt-3 text-left transition ${selectedTpl === template.name ? "is-selected" : ""}`} style={{ "--accent": categoryColor(template.cat) } as CSSProperties} onClick={() => selectTemplate(template)}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="template-icon flex h-8 w-8 shrink-0 items-center justify-center"><Icon className="h-[16px] w-[16px]" strokeWidth={1.9} /></span>
                  <span className="min-w-0 truncate text-[13px] font-semibold text-[#15212d]">{template.name}</span>
                </div>
                <p className="line-clamp-3 text-[11.5px] leading-[1.62] text-[#647485]">{template.desc}</p>
              </button>
            );
          })}
        </div>
        {!filteredTemplates.length && <div className="py-10 text-center text-[12.5px] text-[#8b99a7]">No ideas in this category yet</div>}
      </div>
    </div>
  );
}
