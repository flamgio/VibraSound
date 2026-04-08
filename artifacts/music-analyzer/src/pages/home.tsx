import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAnalyzeMusic } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  WaveformIcon, MusicNoteIcon, SparkleIcon, AlertIcon,
  YoutubeIcon, SoundCloudIcon, DnaIcon, FrequencyIcon,
  CellIcon, ArrowRightIcon
} from "@/components/icons";

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground/70"
      }`}
    >
      {active && (
        <motion.div
          layoutId="tab-bg"
          className="absolute inset-0 rounded-xl bg-background shadow-sm border border-border/50"
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function SingleAnalyzer() {
  const [url, setUrl] = useState("");
  const [, setLocation] = useLocation();
  const analyzeMutation = useAnalyzeMusic();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || analyzeMutation.isPending) return;
    analyzeMutation.mutate(
      { data: { url: url.trim() } },
      { onSuccess: (data) => setLocation(`/analysis/${data.id}`) }
    );
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAnalyze}>
        <div className="relative flex items-center gap-2 bg-background/70 backdrop-blur-md rounded-2xl border border-border/60 p-2 shadow-lg focus-within:border-primary/40 focus-within:shadow-primary/10 focus-within:shadow-xl transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ml-1">
            <MusicNoteIcon className="w-5 h-5 text-primary" />
          </div>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube or SoundCloud link..."
            className="flex-1 h-11 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
            data-testid="input-url"
            disabled={analyzeMutation.isPending}
            autoComplete="off"
          />
          <Button
            type="submit"
            size="lg"
            className="h-11 px-6 rounded-xl font-semibold text-sm gap-2 shrink-0"
            disabled={!url.trim() || analyzeMutation.isPending}
            data-testid="button-analyze"
          >
            <AnimatePresence mode="wait">
              {analyzeMutation.isPending ? (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <WaveformIcon className="w-4 h-4 animate-pulse" /> Analyzing...
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <SparkleIcon className="w-4 h-4" /> Analyze
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {analyzeMutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-destructive/8 border border-destructive/20 text-sm"
          >
            <AlertIcon className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive text-xs uppercase tracking-wide">Analysis Failed</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {(analyzeMutation.error as Error)?.message || "Could not analyze this URL. Verify the link and try again."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <YoutubeIcon className="w-3.5 h-3.5 text-red-500/70" /> YouTube
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <SoundCloudIcon className="w-3.5 h-3.5 text-orange-500/70" /> SoundCloud
        </div>
        <div className="w-px h-3 bg-border" />
        <span className="text-xs text-muted-foreground/70">Direct audio links</span>
      </div>
    </div>
  );
}

function PlaylistAnalyzer() {
  const [urls, setUrls] = useState("");
  const [, setLocation] = useLocation();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = urls.split("\n").map(u => u.trim()).filter(Boolean);
    if (urlList.length === 0 || isPending) return;
    if (urlList.length > 20) {
      setError("Maximum 20 URLs per batch. Please remove some links.");
      return;
    }

    setIsPending(true);
    setError(null);
    try {
      const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      const resp = await fetch(`${BASE_URL}/api/analyze-playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlList }),
      });
      if (!resp.ok) throw new Error("Playlist analysis failed");
      const data = await resp.json();
      sessionStorage.setItem("playlist_results", JSON.stringify(data));
      setLocation("/playlist");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Playlist analysis failed");
    } finally {
      setIsPending(false);
    }
  };

  const urlCount = urls.split("\n").filter(l => l.trim()).length;

  return (
    <div className="space-y-4">
      <form onSubmit={handleAnalyze} className="space-y-3">
        <div className="relative rounded-2xl border border-border/60 bg-background/70 backdrop-blur-md overflow-hidden focus-within:border-primary/40 transition-all duration-300 shadow-lg focus-within:shadow-primary/10 focus-within:shadow-xl">
          <Textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder={"Paste one URL per line:\nhttps://youtube.com/watch?v=...\nhttps://youtube.com/watch?v=...\nhttps://soundcloud.com/..."}
            className="min-h-[140px] border-0 bg-transparent text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/40 resize-none p-4 font-mono leading-relaxed"
            disabled={isPending}
          />
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/40 bg-muted/20">
            <span className="text-xs text-muted-foreground">
              {urlCount > 0 ? `${urlCount} URL${urlCount > 1 ? "s" : ""} detected` : "One URL per line · Max 20 tracks"}
            </span>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-5 rounded-lg font-semibold text-xs gap-1.5"
              disabled={urlCount === 0 || isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-1.5"><WaveformIcon className="w-3.5 h-3.5 animate-pulse" />Analyzing {urlCount}...</span>
              ) : (
                <span className="flex items-center gap-1.5"><SparkleIcon className="w-3.5 h-3.5" />Analyze Playlist</span>
              )}
            </Button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-destructive/8 border border-destructive/20 text-sm"
          >
            <AlertIcon className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FEATURES = [
  { icon: FrequencyIcon, label: "Frequency Analysis", desc: "7-band spectrum from sub-bass to brilliance", color: "text-blue-500", bg: "bg-blue-500/8" },
  { icon: DnaIcon, label: "Cellular Resonance", desc: "Solfeggio & healing frequency alignment", color: "text-violet-500", bg: "bg-violet-500/8" },
  { icon: CellIcon, label: "Biofield Impact", desc: "Scientific assessment of cellular interaction", color: "text-emerald-500", bg: "bg-emerald-500/8" },
  { icon: MusicNoteIcon, label: "Lyrics + Animations", desc: "Get lyrics with animated video editor export", color: "text-amber-500", bg: "bg-amber-500/8" },
];

export default function Home() {
  const [tab, setTab] = useState<"single" | "playlist">("single");

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Hero */}
      <div className="flex flex-col items-center text-center pt-16 pb-10 px-4 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-semibold mb-7 tracking-wide uppercase">
            <SparkleIcon className="w-3.5 h-3.5" />
            Music Rhythm &amp; Cellular Science
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-[4.5rem] font-bold tracking-tight leading-[1.04] mb-6">
            Discover the
            <br />
            <span className="gradient-text">Hidden Physics</span>
            <br />
            of Sound
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            Analyze any song's BPM, frequency spectrum, cellular resonance, and get
            animated lyrics — perfect for music producers and video editors.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl"
        >
          {/* Mode Tabs */}
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-muted/50 border border-border/50 mb-4">
            <Tab label="Single Track" active={tab === "single"} onClick={() => setTab("single")} />
            <Tab label="Playlist (Batch)" active={tab === "playlist"} onClick={() => setTab("playlist")} />
          </div>

          <AnimatePresence mode="wait">
            {tab === "single" ? (
              <motion.div
                key="single"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
              >
                <SingleAnalyzer />
              </motion.div>
            ) : (
              <motion.div
                key="playlist"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <PlaylistAnalyzer />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-3xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 pb-8"
      >
        {FEATURES.map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 rounded-2xl bg-background/50 backdrop-blur border border-border/50 flex flex-col gap-3 hover:border-border/80 hover:bg-background/70 transition-all duration-200 group"
          >
            <div className={`w-9 h-9 rounded-xl ${feat.bg} flex items-center justify-center`}>
              <feat.icon className={`w-[18px] h-[18px] ${feat.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold leading-snug">{feat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{feat.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Fine print */}
      <div className="text-center px-4 pb-8 text-xs text-muted-foreground/50 max-w-lg mx-auto leading-relaxed">
        Analysis is computed from URL metadata and acoustic theory models.
        Results are deterministic per track. Healing frequency research references solfeggio and bioacoustic literature.
      </div>
    </div>
  );
}
