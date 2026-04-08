import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AnimatedBackground } from "./animated-background";
import { WaveformIcon, HistoryIcon, ChartBarIcon, SunIcon, MoonIcon } from "./icons";
import { motion, AnimatePresence } from "framer-motion";

function NavLink({ href, label, Icon }: { href: string; label: string; Icon: React.FC<{ className?: string }> }) {
  const [location] = useLocation();
  const active = location === href;
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
      data-testid={`link-${label.toLowerCase()}`}
    >
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 rounded-lg bg-card border border-border/80 shadow-sm"
          transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
        />
      )}
      <Icon className="relative z-10 w-[15px] h-[15px]" />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vibrasound-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ?? (prefersDark ? "dark" : "dark"); // default dark
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("vibrasound-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Header */}
      <header className={`w-full h-[58px] sticky top-0 z-50 flex items-center px-5 justify-between transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/60"
          : "bg-transparent"
      }`}>
        <Link href="/" className="flex items-center gap-2.5 group" data-testid="link-home">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors" />
            <WaveformIcon className="relative z-10 w-[17px] h-[17px] text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-[16px] tracking-tight">VibraSound</span>
            <span className="text-[10px] font-mono-custom text-muted-foreground/60 font-medium tracking-widest uppercase hidden sm:inline">Signal</span>
          </div>
        </Link>

        <nav className="flex items-center gap-0.5">
          <NavLink href="/history" label="History" Icon={HistoryIcon} />
          <NavLink href="/stats" label="Stats" Icon={ChartBarIcon} />
          <div className="w-px h-5 bg-border/70 mx-1.5" />
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "light" ? (
                <motion.div key="moon" initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }}>
                  <MoonIcon className="w-[15px] h-[15px]" />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ opacity: 0, rotate: 30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -30 }}>
                  <SunIcon className="w-[15px] h-[15px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-20 z-10 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-5 px-6 mt-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground/60">
            <WaveformIcon className="w-3 h-3 text-primary/40" />
            <span className="font-mono-custom tracking-wide">VIBRASOUND</span>
            <span className="mx-1 opacity-40">—</span>
            <span>Rhythm · Frequency · Resonance</span>
          </div>
          <p className="text-[11px] text-muted-foreground/40 font-mono-custom">
            Analysis based on acoustic &amp; solfeggio research
          </p>
        </div>
      </footer>
    </div>
  );
}
