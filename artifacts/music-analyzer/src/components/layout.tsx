import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Activity, Clock, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./animated-background";

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [location] = useLocation();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      <header className="w-full h-16 border-b border-border/40 backdrop-blur-md sticky top-0 z-50 flex items-center px-6 justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer" data-testid="link-home">
          <Activity className="w-6 h-6 text-primary group-hover:animate-pulse" />
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            VibraSound
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/history" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/history' ? 'text-primary' : 'text-muted-foreground'}`} data-testid="link-history">
            History
          </Link>
          <Link href="/stats" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/stats' ? 'text-primary' : 'text-muted-foreground'}`} data-testid="link-stats">
            Stats
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full" data-testid="button-theme-toggle">
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
        </nav>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 z-10 relative">
        {children}
      </main>
    </div>
  );
}
