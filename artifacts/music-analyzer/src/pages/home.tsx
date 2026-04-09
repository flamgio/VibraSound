import { useState } from "react";
import { useLocation } from "wouter";
import { useAnalyzeMusic } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  WaveformIcon, MusicNoteIcon, SparkleIcon, AlertIcon,
  YoutubeIcon, SoundCloudIcon, DnaIcon, FrequencyIcon,
  CellIcon, PlaylistIcon, HeadphonesIcon, FilmIcon, BpmIcon, ZapIcon
} from "@/components/icons";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function FadeIn({
  children, delay = 0, className = ""
}: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
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
    <form onSubmit={handleAnalyze} className="space-y-3">
      <div
        className={`vb-input relative flex items-center gap-2 rounded-2xl p-1.5 transition-all duration-300 ${
          analyzeMutation.isPending
            ? "bg-primary/6 ring-2 ring-primary/30 shadow-lg"
            : "bg-card/80 backdrop-blur-sm ring-1 ring-border/60 hover:ring-border focus-within:ring-2 focus-within:ring-primary/30 shadow-md"
        }`}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ml-0.5 transition-colors ${
          analyzeMutation.isPending ? "bg-primary/20" : "bg-primary/10"
        }`}>
          <MusicNoteIcon className={`w-4 h-4 transition-colors ${analyzeMutation.isPending ? "text-primary" : "text-primary"}`} />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a YouTube, SoundCloud, or audio URL…"
          className="flex-1 bg-transparent text-[14px] font-body font-medium placeholder:text-muted-foreground/40 outline-none text-foreground min-w-0 py-1.5"
          data-testid="input-url"
          disabled={analyzeMutation.isPending}
          autoComplete="off"
        />
        <motion.button
          type="submit"
          disabled={!url.trim() || analyzeMutation.isPending}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.01 }}
          className="btn-glow flex items-center gap-2 h-9 px-5 bg-primary text-primary-foreground rounded-xl text-[13px] font-semibold disabled:opacity-45 disabled:cursor-not-allowed transition-all shrink-0 shadow-md"
          data-testid="button-analyze"
        >
          <AnimatePresence mode="wait">
            {analyzeMutation.isPending ? (
              <motion.span
                key="l"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="flex items-center gap-2"
              >
                <WaveformIcon className="w-3.5 h-3.5 animate-pulse" />
                Analyzing…
              </motion.span>
            ) : (
              <motion.span
                key="i"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="flex items-center gap-2"
              >
                <SparkleIcon className="w-3.5 h-3.5" />
                Analyze
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {analyzeMutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="flex items-center gap-2 text-destructive text-[13px] px-2 pt-1"
          >
            <AlertIcon className="w-4 h-4 shrink-0" />
            <span className="font-body">Could not analyze this URL. Please check the link and try again.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4 px-2">
        <span className="label-xs opacity-70">supports</span>
        <div className="flex items-center gap-4">
          {[
            { Icon: YoutubeIcon, label: "YouTube", color: "text-red-500" },
            { Icon: SoundCloudIcon, label: "SoundCloud", color: "text-orange-500" },
            { Icon: MusicNoteIcon, label: "Direct audio", color: "text-muted-foreground" },
          ].map(({ Icon, label, color }) => (
            <div key={label} className={`flex items-center gap-1.5 text-[12px] font-medium ${color}`}>
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline font-body">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

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
      <div className={`relative rounded-2xl overflow-hidden ring-1 transition-all duration-300 ${
        loading ? "ring-primary/35 shadow-lg shadow-primary/10" : "ring-border/60 bg-card/80 backdrop-blur-sm hover:ring-border focus-within:ring-2 focus-within:ring-primary/30"
      }`}>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={"Paste URLs, one per line…\n\nhttps://youtube.com/watch?v=…\nhttps://soundcloud.com/…"}
          rows={5}
          disabled={loading}
          className="w-full bg-transparent text-[13px] font-mono-custom placeholder:text-muted-foreground/30 placeholder:font-body outline-none text-foreground resize-none p-4 leading-relaxed"
          data-testid="input-urls"
        />
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-muted/15">
          <span className="label-xs">
            {lineCount > 0 ? `${lineCount} / 20 URLs` : "Up to 20 tracks"}
          </span>
          <motion.button
            type="submit"
            disabled={lineCount === 0 || loading}
            whileTap={{ scale: 0.96 }}
            className="btn-glow flex items-center gap-2 h-8 px-4 bg-primary text-primary-foreground rounded-lg text-[12px] font-semibold disabled:opacity-45 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {loading ? (
              <><WaveformIcon className="w-3 h-3 animate-pulse" />Analyzing {lineCount} tracks…</>
            ) : (
              <><PlaylistIcon className="w-3 h-3" />Analyze Playlist</>
            )}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-destructive text-[13px] px-2"
          >
            <AlertIcon className="w-4 h-4 shrink-0" />
            <span className="font-body">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

const FEATURES = [
  {
    num: "01",
    label: "Tempo & BPM",
    desc: "Precision beat-per-minute detection with tempo variation mapping across the full track timeline.",
    Icon: BpmIcon,
    accent: "from-violet-500/20 to-violet-500/5",
    border: "border-violet-500/18",
    iconBg: "bg-violet-500/12",
    iconColor: "text-violet-400",
    dotColor: "bg-violet-500",
  },
  {
    num: "02",
    label: "Musical Key",
    desc: "Root key and scale identification using chromatic harmonic analysis and pitch-class profiling.",
    Icon: MusicNoteIcon,
    accent: "from-sky-500/20 to-sky-500/5",
    border: "border-sky-500/18",
    iconBg: "bg-sky-500/12",
    iconColor: "text-sky-400",
    dotColor: "bg-sky-500",
  },
  {
    num: "03",
    label: "7-Band Spectrum",
    desc: "Sub-bass through presence frequency energy distribution across the full auditory spectrum.",
    Icon: FrequencyIcon,
    accent: "from-amber-500/20 to-amber-500/5",
    border: "border-amber-500/18",
    iconBg: "bg-amber-500/12",
    iconColor: "text-amber-400",
    dotColor: "bg-amber-500",
  },
  {
    num: "04",
    label: "Cellular Resonance",
    desc: "Solfeggio alignment score (0–100) measuring bioacoustic and biofield impact potential.",
    Icon: CellIcon,
    accent: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/18",
    iconBg: "bg-emerald-500/12",
    iconColor: "text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  {
    num: "05",
    label: "Healing Frequencies",
    desc: "Alignment with 396, 432, 528, 639, 741, 852, 963 Hz — the solfeggio sacred tone matrix.",
    Icon: DnaIcon,
    accent: "from-rose-500/20 to-rose-500/5",
    border: "border-rose-500/18",
    iconBg: "bg-rose-500/12",
    iconColor: "text-rose-400",
    dotColor: "bg-rose-500",
  },
  {
    num: "06",
    label: "Lyrics + Video Export",
    desc: "Animated lyrics editor with 6 animation styles and 1080p WebM video export for creators.",
    Icon: FilmIcon,
    accent: "from-indigo-500/20 to-indigo-500/5",
    border: "border-indigo-500/18",
    iconBg: "bg-indigo-500/12",
    iconColor: "text-indigo-400",
    dotColor: "bg-indigo-500",
  },
];

const TICKER = [
  "BPM Detection", "Solfeggio Alignment", "Frequency Spectrum",
  "Cellular Resonance", "Healing Tones", "Batch Analysis",
  "Lyrics Studio", "1080p Export", "Dark Mode", "Real-time Analysis",
  "Musical Key", "Energy Mapping",
];

export default function HomePage() {
  const [mode, setMode] = useState<"single" | "playlist">("single");

  return (
    <div className="py-12 sm:py-20 space-y-20">

      {/* ── Hero ── */}
      <div className="space-y-10">

        {/* Live badge */}
        <FadeIn delay={0}>
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-primary/8 ring-1 ring-primary/20">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="label-xs text-primary tracking-widest">Signal Analysis Engine — Active</span>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.07}>
          <h1
            className="font-display leading-[0.96] tracking-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span className="block text-[clamp(3rem,8.5vw,6.5rem)] text-foreground">
              Decode the
            </span>
            <span className="block text-[clamp(3rem,8.5vw,6.5rem)] gradient-text">
              physics of sound.
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.13}>
          <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-[1.7] max-w-[520px] font-body font-[350]">
            Paste any music URL for instant BPM, key, frequency spectrum, and
            cellular resonance analysis — plus an animated lyrics studio for video creators.
          </p>
        </FadeIn>

        {/* Analyzer card */}
        <FadeIn delay={0.18}>
          <div className="max-w-2xl space-y-4">
            {/* Mode switcher */}
            <div className="inline-flex items-center gap-0.5 p-1 bg-muted/30 ring-1 ring-border/50 rounded-2xl backdrop-blur-sm">
              {(["single", "playlist"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`relative px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-200 font-body ${
                    mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="mode-bg"
                      className="absolute inset-0 rounded-xl bg-card ring-1 ring-border/80 shadow-sm"
                      transition={{ type: "spring", duration: 0.38, bounce: 0.08 }}
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

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {mode === "single" ? <SingleAnalyzer /> : <PlaylistAnalyzer />}
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={0.22}>
          <div className="flex items-end gap-8 flex-wrap">
            {[
              { value: "7", label: "Solfeggio tones" },
              { value: "7", label: "Frequency bands" },
              { value: "0–100", label: "Resonance range" },
              { value: "20", label: "Max batch" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="data-num text-[26px] text-foreground">{stat.value}</span>
                <span className="label-xs">{stat.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── Ticker ── */}
      <FadeIn delay={0.25}>
        <div className="relative overflow-hidden border-y border-border/40 py-3.5 bg-muted/8">
          <div className="flex animate-ticker whitespace-nowrap gap-0 select-none">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-6 text-[10.5px] font-mono-custom text-muted-foreground/50 tracking-[0.12em] uppercase"
              >
                <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Feature Grid ── */}
      <div className="space-y-7">
        <FadeIn>
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-[22px] sm:text-[28px] font-700 tracking-tight">
              What we analyze
            </h2>
            <span className="label-xs opacity-60">{FEATURES.length} modules</span>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.04 + i * 0.07,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative group overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${feat.accent} ring-1 ${feat.border} cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="absolute inset-0 bg-card/65 backdrop-blur-sm" />
              <div className="relative z-10 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${feat.iconBg} flex items-center justify-center ring-1 ring-white/8`}>
                    <feat.Icon className={`w-[18px] h-[18px] ${feat.iconColor}`} />
                  </div>
                  <span className="font-mono-custom text-[10px] text-muted-foreground/35 font-medium tracking-wider">
                    {feat.num}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display font-700 text-[14.5px] tracking-tight">{feat.label}</h3>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed font-body">{feat.desc}</p>
                </div>
                <div className={`w-6 h-0.5 rounded-full ${feat.dotColor} opacity-60`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA Strip ── */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-primary/5 ring-1 ring-primary/12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center ring-1 ring-primary/20">
              <ZapIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-700 text-[14px]">Try it now — it's free</p>
              <p className="text-[12.5px] text-muted-foreground font-body mt-0.5">Deterministic results per URL. Instant delivery.</p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/45 leading-relaxed text-center sm:text-right max-w-xs font-body">
            Analysis is algorithmically derived from acoustic properties and solfeggio frequency research.
            Not a substitute for professional audio tools.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
