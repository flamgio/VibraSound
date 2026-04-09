import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { AnimatedBackground } from "./animated-background";
import { WaveformIcon, HistoryIcon, ChartBarIcon, SunIcon, MoonIcon } from "./icons";
import { motion, AnimatePresence } from "framer-motion";

function NavLink({
  href, label, Icon
}: { href: string; label: string; Icon: React.FC<{ className?: string }> }) {
  const [location] = useLocation();
  const active = location === href;
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 rounded-xl transition-all duration-200 ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
      data-testid={`link-${label.toLowerCase()}`}
    >
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 rounded-xl bg-card border border-border/80 shadow-sm"
          transition={{ type: "spring", duration: 0.4, bounce: 0.08 }}
        />
      )}
      <Icon className="relative z-10 w-[14px] h-[14px]" />
      <span className="relative z-10 font-body">{label}</span>
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vibrasound-theme") as "light" | "dark" | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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
      <header
        className={`w-full h-[60px] sticky top-0 z-50 flex items-center px-5 sm:px-7 justify-between transition-all duration-400 ${
          scrolled
            ? "bg-background/85 backdrop-blur-2xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" data-testid="link-home">
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-[10px] bg-primary/18 group-hover:bg-primary/26 transition-colors duration-200" />
            <div className="absolute inset-0 rounded-[10px] ring-1 ring-inset ring-primary/25" />
            <WaveformIcon className="relative z-10 w-[16px] h-[16px] text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-700 text-[15px] tracking-tight">VibraSound</span>
            <span className="hidden sm:inline text-[9.5px] font-mono-custom text-muted-foreground/50 tracking-[0.14em] uppercase">Signal</span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          <NavLink href="/history" label="History" Icon={HistoryIcon} />
          <NavLink href="/stats" label="Stats" Icon={ChartBarIcon} />
          <div className="w-px h-4 bg-border/60 mx-2" />
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.92 }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ring-0"
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "light" ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -25, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 25, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <MoonIcon className="w-[14px] h-[14px]" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: 25, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -25, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <SunIcon className="w-[14px] h-[14px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24 z-10 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[11.5px] text-muted-foreground/50">
            <WaveformIcon className="w-3 h-3 text-primary/35" strokeWidth={1.8} />
            <span className="font-mono-custom tracking-[0.1em] uppercase text-[10px]">VibraSound</span>
            <span className="opacity-40 mx-0.5">·</span>
            <span className="font-body">Rhythm · Frequency · Resonance</span>
          </div>
          <p className="text-[10.5px] text-muted-foreground/35 font-mono-custom">
            Analysis derived from acoustic &amp; solfeggio research
          </p>
        </div>
      </footer>
    </div>
  );
}
