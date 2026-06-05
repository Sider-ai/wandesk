import AgentGuideCard from "./AgentGuideCard";

type Variant = "light" | "brass" | "dark";

export default function AgentGuideView({
  agentName,
  variant = "light",
  className = "",
  innerClassName = ""
}: {
  agentName: string;
  variant?: Variant;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}>
      <div className={`mx-auto w-full max-w-[680px] ${innerClassName}`}>
        <AgentGuideCard agentName={agentName} variant={variant} />
      </div>
    </div>
  );
}
