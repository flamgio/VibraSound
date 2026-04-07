import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./animated-background";
import { WaveformIcon, HistoryIcon, ChartBarIcon, SunIcon, MoonIcon } from "./icons";

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vibrasound-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("vibrasound-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const navLink = (href: string, label: string, Icon: React.FC<{ className?: string }>) => {
    const active = location === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
          active
            ? "text-primary bg-primary/10"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
        }`}
        data-testid={`link-${label.toLowerCase()}`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Header */}
      <header
        className={`w-full h-16 sticky top-0 z-50 flex items-center px-6 justify-between transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5 group" data-testid="link-home">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
            <WaveformIcon className="w-[18px] h-[18px] text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            VibraSound
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLink("/history", "History", HistoryIcon)}
          {navLink("/stats", "Stats", ChartBarIcon)}
          <div className="w-px h-5 bg-border/60 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl w-9 h-9 hover:bg-muted/70"
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <MoonIcon className="w-[18px] h-[18px]" />
            ) : (
              <SunIcon className="w-[18px] h-[18px]" />
            )}
          </Button>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 z-10 relative">
        {children}
      </main>

      {/* Footer */}
      <footer className="z-10 relative border-t border-border/40 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <WaveformIcon className="w-3.5 h-3.5 text-primary/60" />
            <span className="font-medium">VibraSound</span>
            <span>— Music Rhythm &amp; Cellular Resonance Analysis</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Analysis based on acoustic theory and solfeggio research</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
