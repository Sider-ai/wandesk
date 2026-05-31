import type { CSSProperties } from "react";

const ink = "#f9ead1";
const muted = "#b99d73";
const teal = "#041c1c";
const brass = "#d6b15f";

const shellStyle: CSSProperties = {
  background:
    "radial-gradient(circle at 18% 8%,rgba(255,189,56,0.22),transparent 22%),radial-gradient(circle at 82% 16%,rgba(103,161,160,0.18),transparent 24%),linear-gradient(145deg,#071918,#021010 58%,#190d06)",
  color: ink,
  fontFamily: "Georgia,'Times New Roman','PingFang SC',serif"
};

const grainStyle: CSSProperties = {
  background:
    "repeating-linear-gradient(110deg,rgba(255,255,255,0.025) 0px,transparent 1px,transparent 7px),repeating-conic-gradient(rgba(255,230,203,0.025) 0% 25%,transparent 0% 50%) 0 0/18px 18px",
  mixBlendMode: "screen",
  opacity: 0.75
};

const brassButton: CSSProperties = {
  background: "linear-gradient(180deg,#ffe0a0,#d4ad54 48%,#8c6124)",
  border: "1px solid rgba(51,31,8,0.88)",
  color: "#231506",
  boxShadow: "0 2px 0 rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,251,214,0.55),inset 0 -10px 18px rgba(91,50,10,0.28)",
  textShadow: "0 1px 0 rgba(255,238,170,0.38)"
};

const darkButton: CSSProperties = {
  background: "linear-gradient(180deg,#123837,#071918)",
  border: "1px solid rgba(255,230,203,0.2)",
  color: ink,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08),0 2px 0 rgba(0,0,0,0.4)"
};

const paper: CSSProperties = {
  background:
    "linear-gradient(180deg,#fff3d8,#ead2a5 62%,#d7b97f),repeating-linear-gradient(90deg,rgba(82,55,22,0.045) 0px,rgba(82,55,22,0.045) 1px,transparent 1px,transparent 9px)",
  border: "1px solid rgba(62,37,10,0.34)",
  color: "#2b1a08",
  boxShadow: "0 14px 28px rgba(0,0,0,0.26),0 2px 0 rgba(0,0,0,0.28),inset 0 1px 0 rgba(255,255,232,0.7),inset 0 -18px 28px rgba(126,80,24,0.1)"
};

const leather: CSSProperties = {
  background:
    "linear-gradient(180deg,rgba(12,48,46,0.92),rgba(4,24,24,0.96)),repeating-linear-gradient(35deg,rgba(255,255,255,0.04) 0px,transparent 1px,transparent 5px)",
  border: "1px solid rgba(255,230,203,0.13)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -22px 44px rgba(0,0,0,0.25),0 12px 24px rgba(0,0,0,0.2)"
};

const ledger: CSSProperties = {
  background: "linear-gradient(180deg,#133837,#092120 48%,#041514)",
  border: "1px solid rgba(255,230,203,0.16)",
  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.28),0 12px 24px rgba(0,0,0,0.22)"
};

export { brass, brassButton, darkButton, grainStyle, ink, leather, ledger, muted, paper, shellStyle, teal };
