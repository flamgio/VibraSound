import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useAnalyzeMusic } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WaveformIcon, MusicNoteIcon, SparkleIcon, AlertIcon,
  YoutubeIcon, SoundCloudIcon, DnaIcon, FrequencyIcon,
  CellIcon, PlaylistIcon, HeadphonesIcon, FilmIcon
} from "@/components/icons";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

/* ── Stagger wrapper ── */
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.32, 0.72, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Single Track Analyzer ── */
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
    <form onSubmit={handleAnalyze} className="space-y-3">
      {/* URL input */}
      <div className={`relative flex items-center gap-2 bg-card border rounded-xl p-1.5 shadow-md transition-all duration-300 ${
        analyzeMutation.isPending
          ? "border-primary/40 shadow-primary/10"
          : "border-border/80 hover:border-border focus-within:border-primary/50 focus-within:shadow-primary/8"
      }`}>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 ml-0.5">
          <MusicNoteIcon className="w-4 h-4 text-primary" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube, SoundCloud, or audio URL…"
          className="flex-1 bg-transparent text-[14px] font-medium placeholder:text-muted-foreground/45 outline-none text-foreground min-w-0 py-1"
          data-testid="input-url"
          disabled={analyzeMutation.isPending}
          autoComplete="off"
        />
        <motion.button
          type="submit"
          disabled={!url.trim() || analyzeMutation.isPending}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 h-9 px-5 bg-primary text-primary-foreground rounded-lg text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 shrink-0"
          data-testid="button-analyze"
        >
          <AnimatePresence mode="wait">
            {analyzeMutation.isPending ? (
              <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <WaveformIcon className="w-3.5 h-3.5 animate-pulse" />
                Analyzing
              </motion.span>
            ) : (
              <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <SparkleIcon className="w-3.5 h-3.5" />
                Analyze
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {analyzeMutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-destructive text-[13px] px-2"
        >
          <AlertIcon className="w-4 h-4 shrink-0" />
          <span>Could not analyze this URL. Check the link and try again.</span>
        </motion.div>
      )}

      {/* Source hints */}
      <div className="flex items-center gap-3 px-1.5">
        <span className="label-xs">supports</span>
        <div className="flex items-center gap-3">
          {[
            { Icon: YoutubeIcon, label: "YouTube", color: "text-red-500" },
            { Icon: SoundCloudIcon, label: "SoundCloud", color: "text-orange-500" },
            { Icon: MusicNoteIcon, label: "Direct audio", color: "text-muted-foreground" },
          ].map(({ Icon, label, color }) => (
            <div key={label} className={`flex items-center gap-1.5 text-[12px] font-medium ${color}`}>
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

/* ── Playlist Analyzer ── */
function PlaylistAnalyzer() {
  const [urls, setUrls] = useState("");
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = urls.split("\n").map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    if (lines.length > 20) { setError("Maximum 20 URLs at once"); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/analyze-playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: lines }),
      });
      const data = await res.json();
      sessionStorage.setItem("playlist_results", JSON.stringify(data));
      setLocation("/playlist");
    } catch {
      setError("Analysis failed. Please check your URLs.");
    } finally {
      setLoading(false);
    }
  };

  const lineCount = urls.split("\n").filter(l => l.trim()).length;

  return (
    <form onSubmit={handleAnalyze} className="space-y-3">
      <div className={`relative bg-card border rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
        loading ? "border-primary/40" : "border-border/80 focus-within:border-primary/50"
      }`}>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={"Paste URLs, one per line…\n\nhttps://youtube.com/watch?v=…\nhttps://soundcloud.com/…"}
          rows={5}
          disabled={loading}
          className="w-full bg-transparent text-[13px] font-mono-custom placeholder:text-muted-foreground/35 placeholder:font-sans outline-none text-foreground resize-none p-4 leading-relaxed"
          data-testid="input-urls"
        />
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60 bg-muted/20">
          <span className="label-xs">{lineCount > 0 ? `${lineCount} / 20 URLs` : "Up to 20 tracks"}</span>
          <motion.button
            type="submit"
            disabled={lineCount === 0 || loading}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 h-8 px-4 bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            {loading ? (
              <><WaveformIcon className="w-3 h-3 animate-pulse" />Analyzing {lineCount} tracks…</>
            ) : (
              <><PlaylistIcon className="w-3 h-3" />Analyze Playlist</>
            )}
          </motion.button>
        </div>
      </div>
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-destructive text-[13px] px-1">
          <AlertIcon className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}
    </form>
  );
}

/* ── Features ── */
const FEATURES = [
  { num: "01", label: "Tempo & BPM", desc: "Precise beat-per-minute detection with tempo variation mapping", Icon: WaveformIcon, color: "text-violet-500 dark:text-violet-400", bg: "bg-violet-500/10" },
  { num: "02", label: "Musical Key", desc: "Root key and scale identification using harmonic analysis", Icon: MusicNoteIcon, color: "text-sky-500 dark:text-sky-400", bg: "bg-sky-500/10" },
  { num: "03", label: "7-Band Spectrum", desc: "Sub-bass to presence frequency energy distribution", Icon: FrequencyIcon, color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10" },
  { num: "04", label: "Cellular Resonance", desc: "Solfeggio alignment score measuring bioacoustic impact", Icon: CellIcon, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  { num: "05", label: "Healing Frequencies", desc: "Alignment with 396, 432, 528, 639, 741, 852, 963 Hz", Icon: DnaIcon, color: "text-pink-500 dark:text-pink-400", bg: "bg-pink-500/10" },
  { num: "06", label: "Lyrics + Video", desc: "Animated lyrics editor with 1080p WebM export for editors", Icon: FilmIcon, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-500/10" },
];

/* ── Ticker items ── */
const TICKER = ["BPM Detection", "Solfeggio Alignment", "Frequency Spectrum", "Cellular Resonance", "Healing Tones", "Batch Analysis", "Lyrics Studio", "1080p Export", "Dark Mode", "Real-time Analysis"];

export default function HomePage() {
  const [mode, setMode] = useState<"single" | "playlist">("single");

  return (
    <div className="py-10 sm:py-16 space-y-16">
      {/* ── Hero ── */}
      <div className="space-y-8">
        {/* Badge */}
        <FadeIn delay={0}>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="text-[11px] font-mono-custom font-medium text-primary tracking-widest uppercase">Signal Analysis Engine</span>
            </div>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.06}>
          <h1 className="font-display font-bold tracking-tight leading-[1.05]">
            <span className="block text-[clamp(2.6rem,7vw,5rem)] text-foreground">
              Decode the
            </span>
            <span className="block text-[clamp(2.6rem,7vw,5rem)] gradient-text">
              physics of sound.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed max-w-xl font-body">
            Paste any music URL for instant BPM, key, frequency spectrum, and
            cellular resonance analysis — plus an animated lyrics studio for video creators.
          </p>
        </FadeIn>

        {/* Mode tabs + input */}
        <FadeIn delay={0.14}>
          <div className="space-y-4 max-w-2xl">
            {/* Mode switcher */}
            <div className="flex items-center gap-1 p-1 bg-muted/40 border border-border/60 rounded-xl w-fit">
              {(["single", "playlist"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`relative px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                    mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="mode-bg"
                      className="absolute inset-0 rounded-lg bg-card border border-border/80 shadow-sm"
                      transition={{ type: "spring", duration: 0.35, bounce: 0.1 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {m === "single" ? (
                      <><HeadphonesIcon className="w-3.5 h-3.5" />Single Track</>
                    ) : (
                      <><PlaylistIcon className="w-3.5 h-3.5" />Playlist</>
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* Analyzer */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {mode === "single" ? <SingleAnalyzer /> : <PlaylistAnalyzer />}
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={0.18}>
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { label: "Solfeggio tones mapped", value: "7" },
              { label: "Frequency bands", value: "7" },
              { label: "Resonance score range", value: "0–100" },
              { label: "Max batch size", value: "20" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="data-num text-[22px] text-foreground">{stat.value}</span>
                <span className="label-xs mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── Divider with ticker ── */}
      <FadeIn delay={0.22}>
        <div className="relative overflow-hidden border-y border-border/50 py-3 bg-muted/10">
          <div className="flex animate-ticker whitespace-nowrap gap-0">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 px-5 text-[11px] font-mono-custom font-medium text-muted-foreground/60 tracking-widest uppercase">
                <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Feature Grid ── */}
      <div className="space-y-6">
        <FadeIn delay={0}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display font-bold text-[20px] sm:text-[24px] tracking-tight">What we analyze</h2>
            <span className="label-xs">{FEATURES.length} modules</span>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.num}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
              className="signal-card group p-5 space-y-3 cursor-default"
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-xl ${feat.bg} flex items-center justify-center`}>
                  <feat.Icon className={`w-[18px] h-[18px] ${feat.color}`} />
                </div>
                <span className="font-mono-custom text-[11px] text-muted-foreground/40 font-medium">{feat.num}</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-semibold text-[14px] tracking-tight">{feat.label}</h3>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom disclaimer ── */}
      <FadeIn delay={0}>
        <p className="text-[11.5px] text-muted-foreground/40 leading-relaxed text-center max-w-xl mx-auto font-body">
          Analysis is algorithmically derived from acoustic properties and solfeggio frequency research.
          Results are deterministic per URL. Not a substitute for professional audio analysis tools.
        </p>
      </FadeIn>
    </div>
  );
}
