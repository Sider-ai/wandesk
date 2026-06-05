export type Wallpaper = {
  id: string;
  type: "css";
  label: string;
  desktopTheme: "light" | "dark";
};

export const wallpaperList: Wallpaper[] = [
  { id: "wp-sea-mist-blue-bay", type: "css", label: "Bay Morning Mist", desktopTheme: "light" },
  { id: "wp-morning-sandbar", type: "css", label: "Starry Nightfall", desktopTheme: "dark" },
  { id: "wp-forest-mist", type: "css", label: "Aurora Night", desktopTheme: "dark" },
  { id: "wp-silver-cyan-lake", type: "css", label: "Rose Dawn", desktopTheme: "light" },
  { id: "wp-dusk-rock-shore", type: "css", label: "Dusk Rock Shore", desktopTheme: "dark" },
  { id: "wp-linen-warm-paper", type: "css", label: "Warm Linen Paper", desktopTheme: "light" },
  { id: "wp-amber-clouds", type: "css", label: "Pastel Dream", desktopTheme: "light" },
  { id: "wp-snowlight-peak", type: "css", label: "Deep Sea Glow", desktopTheme: "dark" }
];
