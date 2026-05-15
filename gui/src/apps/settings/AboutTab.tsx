const aboutCopy = {
  title: "__T_SETTINGS_ABOUT_TITLE__",
  desc: "__T_SETTINGS_ABOUT_DESC__",
  lab: "__T_SETTINGS_ABOUT_LAB__",
  more: "__T_SETTINGS_ABOUT_MORE__"
};

export default function AboutTab() {
  return (
    <section>
      <div className="rounded-[13px] border px-5 py-5" style={{ background: "#fff", borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="text-[22px] font-semibold tracking-[-0.02em]" style={{ color: "#2a1f13" }}>{aboutCopy.title}</div>
        <div className="mt-2 text-[13px] font-medium leading-relaxed" style={{ color: "rgba(0,0,0,0.5)" }}>{aboutCopy.desc}</div>
        <div className="mt-4 h-px w-full" style={{ background: "rgba(0,0,0,0.08)" }} />
        <div className="mt-4 text-[12px]" style={{ color: "rgba(0,0,0,0.42)" }}>{aboutCopy.lab}</div>
        <a href="https://github.com/yanglongyun/AIOS" target="_blank" rel="noreferrer" className="mt-3 inline-flex text-[12px] underline underline-offset-4 transition-colors" style={{ color: "rgba(0,0,0,0.4)", textDecorationColor: "rgba(0,0,0,0.2)" }}>{aboutCopy.more}</a>
      </div>
    </section>
  );
}
