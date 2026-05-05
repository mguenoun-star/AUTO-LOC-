import { ThemeConfig, ThemeKey } from "./types";

export const themes: Record<ThemeKey, ThemeConfig> = {
  luxury: {
    name: "Midnight Luxury",
    bg: "bg-[#02040a]",
    accent: "from-blue-400 via-indigo-400 to-purple-500",
    btn: "bg-white text-black hover:bg-white/90",
    mesh: "rgba(37, 99, 235, 0.2)",
    text: "text-white",
    card: "bg-white/5 border-white/5",
    subtext: "text-gray-400",
    glow: "shadow-[0_0_30px_rgba(37,99,235,0.3)]",
    navBg: "bg-black/20"
  },
  solar: {
    name: "Solar Gold",
    bg: "bg-slate-50",
    accent: "from-orange-500 via-amber-500 to-yellow-600",
    btn: "bg-orange-600 hover:bg-orange-500 text-white",
    mesh: "rgba(249, 115, 22, 0.2)",
    text: "text-slate-900",
    card: "bg-white border-slate-200 shadow-lg",
    subtext: "text-slate-600",
    glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]",
    navBg: "bg-white/40"
  },
  cyber: {
    name: "Cyber Neon",
    bg: "bg-black",
    accent: "from-fuchsia-500 via-purple-500 to-cyan-500",
    btn: "bg-fuchsia-600 hover:bg-fuchsia-500 text-white",
    mesh: "rgba(192, 38, 211, 0.15)",
    text: "text-white",
    card: "bg-zinc-900 border-fuchsia-500/30",
    subtext: "text-zinc-400",
    glow: "shadow-[0_0_30px_rgba(192,38,211,0.3)]",
    navBg: "bg-black/60"
  }
};
