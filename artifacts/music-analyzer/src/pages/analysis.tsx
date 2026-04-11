import { useParams, Link } from "wouter";
import { useGetAnalysis, getGetAnalysisQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, Cell, RadialBarChart, RadialBar
} from "recharts";
import {
  BpmIcon, MusicNoteIcon, EnergyIcon, CellIcon, DnaIcon, FrequencyIcon,
  ArrowLeftIcon, ExternalLinkIcon, AlertIcon, WaveformIcon, YoutubeIcon, SparkleIcon
} from "@/components/icons";

// ─── Mood & Genre Classifier ───────────────────────────────────────────────────
function getMoodAndGenre(bpm: number, energy: number, danceability: number) {
  let genre = "Electronic";
  if (bpm < 72) genre = "Ambient / Drone";
  else if (bpm < 90) genre = "Ballad / Soul";
  else if (bpm < 108) genre = "Pop / R&B";
  else if (bpm < 122) genre = "Hip-Hop / Funk";
  else if (bpm < 138) genre = "Dance / House";
  else if (bpm < 158) genre = "Drum & Bass / Techno";
  else genre = "Hardcore / Speedcore";

  const e = energy;
  const d = danceability;
  let mood = "Relaxed";
  if (e > 0.75 && d > 0.70) mood = "Euphoric";
  else if (e > 0.75 && d <= 0.70) mood = "Intense";
  else if (e > 0.55 && d > 0.65) mood = "Groovy";
  else if (e > 0.55 && d <= 0.65) mood = "Energetic";
  else if (e <= 0.55 && d > 0.60) mood = "Chill";
  else if (e <= 0.38 && d <= 0.42) mood = "Melancholic";
  else mood = "Calm";

  const moodColors: Record<string, string> = {
    Euphoric: "#f472b6",
    Intense: "#fb923c",
    Groovy: "#a78bfa",
    Energetic: "#38bdf8",
    Chill: "#34d399",
    Melancholic: "#818cf8",
    Calm: "#67e8f9",
    Relaxed: "#6ee7b7",
  };

  return { genre, mood, moodColor: moodColors[mood] ?? "#a78bfa" };
}

// ─── Shareable PNG Card ─────────────────────────────────────────────────────────
async function downloadShareCard(analysis: {
  title: string; bpm: number; key: string;
  energy: number; danceability: number;
  cellularResonance: { score: number; category: string };
  dominantFrequency: number;
}) {
  const { genre, mood, moodColor } = getMoodAndGenre(analysis.bpm, analysis.energy, analysis.danceability);
  const W = 1200, H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0d0b1e");
  bg.addColorStop(0.5, "#0a1020");
  bg.addColorStop(1, "#0d0b1e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid
  ctx.strokeStyle = "rgba(150,120,255,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Aurora orb top-left
  const orb1 = ctx.createRadialGradient(180, 120, 0, 180, 120, 280);
  orb1.addColorStop(0, "rgba(139,92,246,0.2)");
  orb1.addColorStop(1, "rgba(139,92,246,0)");
  ctx.fillStyle = orb1;
  ctx.fillRect(0, 0, W, H);

  // Aurora orb bottom-right
  const orb2 = ctx.createRadialGradient(W - 150, H - 100, 0, W - 150, H - 100, 250);
  orb2.addColorStop(0, "rgba(56,189,248,0.15)");
  orb2.addColorStop(1, "rgba(56,189,248,0)");
  ctx.fillStyle = orb2;
  ctx.fillRect(0, 0, W, H);

  // Top accent bar
  const topBar = ctx.createLinearGradient(0, 0, W, 0);
  topBar.addColorStop(0, "#7dd3fc");
  topBar.addColorStop(0.5, "#ffffff");
  topBar.addColorStop(1, "rgba(125,211,252,0)");
  ctx.fillStyle = topBar;
  ctx.fillRect(0, 0, W, 3);

  // Card border
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

  // Brand badge
  ctx.font = "600 13px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(125,211,252,0.7)";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("VIBRASOUND  ·  SIGNAL ANALYSIS", 52, 44);

  // Title
  ctx.font = "bold 36px 'Syne', 'Arial', sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const titleText = analysis.title.length > 48 ? analysis.title.slice(0, 48) + "…" : analysis.title;
  ctx.fillText(titleText, 52, 150);

  // Mood + Genre tags
  ctx.font = "600 14px 'JetBrains Mono', monospace";
  ctx.fillStyle = moodColor;
  ctx.fillText(`♪  ${mood}  ·  ${genre}`, 52, 185);

  // Divider
  const div = ctx.createLinearGradient(52, 0, W - 52, 0);
  div.addColorStop(0, "rgba(255,255,255,0.15)");
  div.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = div;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(52, 210); ctx.lineTo(W - 52, 210); ctx.stroke();

  // Metrics grid
  const metrics = [
    { label: "BPM", value: Math.round(analysis.bpm).toString(), color: "#a78bfa" },
    { label: "KEY", value: analysis.key, color: "#38bdf8" },
    { label: "ENERGY", value: `${(analysis.energy * 100).toFixed(0)}%`, color: "#f59e0b" },
    { label: "DANCE", value: `${(analysis.danceability * 100).toFixed(0)}%`, color: "#34d399" },
    { label: "RESONANCE", value: `${analysis.cellularResonance.score}/100`, color: "#fb7185" },
    { label: "FREQ", value: `${analysis.dominantFrequency}Hz`, color: "#67e8f9" },
  ];

  const cols = 3, startX = 52, startY = 250, colW = (W - 104) / cols, rowH = 140;
  for (let i = 0; i < metrics.length; i++) {
    const m = metrics[i];
    const col = i % cols, row = Math.floor(i / cols);
    const x = startX + col * colW, y = startY + row * rowH;

    // Card bg
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    roundRect(ctx, x, y, colW - 16, 115, 16);
    ctx.fill();

    // Left color bar
    ctx.fillStyle = m.color;
    roundRect(ctx, x, y, 3, 115, [2, 0, 0, 2]);
    ctx.fill();

    ctx.font = "600 11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(m.label, x + 20, y + 38);

    ctx.font = "bold 38px 'JetBrains Mono', monospace";
    ctx.fillStyle = m.color;
    ctx.fillText(m.value, x + 20, y + 88);
  }

  // Footer
  ctx.font = "500 12px 'JetBrains Mono', monospace";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("vibrasound.app  ·  Music Rhythm & Cellular Resonance Analyzer", W / 2, H - 28);

  // Download
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${analysis.title.replace(/[^a-z0-9]/gi, "_").slice(0, 40)}-vibrasound.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number | [number, number, number, number]
) {
  const [tl, tr, br, bl] = Array.isArray(r) ? r : [r, r, r, r];
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    highly_beneficial: { label: "Highly Beneficial", cls: "bg-emerald-500/12 text-emerald-500 ring-1 ring-emerald-500/25" },
    beneficial: { label: "Beneficial", cls: "bg-primary/12 text-primary ring-1 ring-primary/25" },
    neutral: { label: "Neutral", cls: "bg-amber-500/12 text-amber-500 ring-1 ring-amber-500/25" },
    potentially_harmful: { label: "Potentially Harmful", cls: "bg-red-500/12 text-red-500 ring-1 ring-red-500/25" },
  };
  const { label, cls } = map[category] ?? { label: category, cls: "" };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-semibold font-body ${cls}`}>
      {label}
    </span>
  );
}

function ResonanceGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? "#10b981" :
    score >= 60 ? "#a78bfa" :
    score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative flex flex-col items-center justify-center">
      <ResponsiveContainer width={168} height={168}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="68%" outerRadius="100%"
          data={[{ value: score, fill: color }]}
          startAngle={220} endAngle={-40}
          barSize={14}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={7}
            background={{ fill: "hsl(var(--muted))", radius: 7 } as never}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="data-num text-[40px] font-display font-700" style={{ color, letterSpacing: "-0.04em" }}>{score}</span>
        <span className="text-[11px] text-muted-foreground font-mono-custom tracking-wider">/ 100</span>
      </div>
    </div>
  );
}

const BAND_COLORS = [
  "#a78bfa", "#22d3ee", "#f59e0b", "#34d399", "#f472b6", "#818cf8", "#38bdf8"
];

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default function AnalysisDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;
  const [isSharing, setIsSharing] = useState(false);

  const { data: analysis, isLoading, isError, error } = useGetAnalysis(id, {
    query: { enabled: !!id && !isNaN(id), queryKey: getGetAnalysisQueryKey(id) }
  });

  const handleShare = useCallback(async () => {
    if (!analysis) return;
    setIsSharing(true);
    try {
      await downloadShareCard(analysis);
    } finally {
      setIsSharing(false);
    }
  }, [analysis]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] gap-6 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/8 ring-1 ring-destructive/20 flex items-center justify-center">
          <AlertIcon className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h2 className="font-display text-xl font-700 tracking-tight">Analysis Not Found</h2>
          <p className="text-muted-foreground mt-1.5 max-w-sm font-body text-[14px]">
            {(error as Error)?.message || "This analysis doesn't exist or could not be loaded."}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2 rounded-xl font-body">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading || !analysis) {
    return (
      <div className="space-y-8 pt-10">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-12 w-3/4 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { cellularResonance } = analysis;
  const resonanceColor =
    cellularResonance.score >= 80 ? "text-emerald-500" :
    cellularResonance.score >= 60 ? "text-violet-400" :
    cellularResonance.score >= 40 ? "text-amber-500" : "text-red-500";

  const topFreqs = [...cellularResonance.healingFrequencies]
    .sort((a, b) => b.presence - a.presence)
    .slice(0, 5);

  return (
    <div className="space-y-6 pt-10 pb-16">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-2.5"
      >
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 h-9 px-3 rounded-xl hover:bg-muted/60 text-muted-foreground font-body"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Back
          </Button>
        </Link>
        <span className="text-muted-foreground/30 text-sm">/</span>
        <span className="text-[13px] text-muted-foreground font-mono-custom">#{analysis.id}</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          {isYouTubeUrl(analysis.url) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/8 text-red-500 text-[11.5px] font-semibold ring-1 ring-red-500/18">
              <YoutubeIcon className="w-3.5 h-3.5" />
              YouTube
            </div>
          )}
          <CategoryBadge category={cellularResonance.category} />
        </div>
        <h1 className="font-display text-[2rem] sm:text-[2.6rem] font-700 tracking-tight leading-[1.05]">
          {analysis.title}
        </h1>
        <div className="flex items-center flex-wrap gap-4">
          <a
            href={analysis.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] text-primary hover:text-primary/80 font-medium transition-colors"
            data-testid="link-source"
          >
            <ExternalLinkIcon className="w-3.5 h-3.5" />
            <span className="font-body">View Original Source</span>
          </a>
          <Link href={`/lyrics/${analysis.id}`}>
            <button
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-violet-400 hover:text-violet-300 transition-colors group font-body"
              data-testid="link-lyrics"
            >
              <SparkleIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              Get Lyrics + Animations
            </button>
          </Link>
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-sky-400 hover:text-sky-300 transition-colors group font-body disabled:opacity-50"
          >
            <SparkleIcon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            {isSharing ? "Generating…" : "Share Card"}
          </button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Tempo",
            value: <><span className="data-num">{Math.round(analysis.bpm)}</span><span className="text-lg font-normal text-muted-foreground ml-1.5">BPM</span></>,
            icon: BpmIcon,
            iconColor: "text-violet-400",
            iconBg: "bg-violet-500/10",
            line: "linear-gradient(90deg, #a78bfa, #818cf8)",
            delay: 0.1,
          },
          {
            label: "Musical Key",
            value: <span className="data-num">{analysis.key}</span>,
            icon: MusicNoteIcon,
            iconColor: "text-sky-400",
            iconBg: "bg-sky-500/10",
            line: "linear-gradient(90deg, #38bdf8, #22d3ee)",
            delay: 0.15,
          },
          {
            label: "Energy Level",
            value: <><span className="data-num">{(analysis.energy * 100).toFixed(0)}</span><span className="text-lg font-normal text-muted-foreground">%</span></>,
            icon: EnergyIcon,
            iconColor: "text-amber-400",
            iconBg: "bg-amber-500/10",
            line: "linear-gradient(90deg, #f59e0b, #fbbf24)",
            delay: 0.2,
          },
          {
            label: "Danceability",
            value: <><span className="data-num">{(analysis.danceability * 100).toFixed(0)}</span><span className="text-lg font-normal text-muted-foreground">%</span></>,
            icon: WaveformIcon,
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/10",
            line: "linear-gradient(90deg, #34d399, #10b981)",
            delay: 0.25,
          },
        ].map((metric) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: metric.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="vb-card vb-metric h-full"
              style={{ "--metric-line": metric.line } as React.CSSProperties}
            >
              <div className="relative z-10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="label-xs opacity-65">{metric.label}</p>
                  <div className={`w-8 h-8 rounded-xl ${metric.iconBg} flex items-center justify-center ring-1 ring-white/6`}>
                    <metric.icon className={`w-4 h-4 ${metric.iconColor}`} />
                  </div>
                </div>
                <div className="font-display text-[2rem] font-700 tracking-tight leading-none">{metric.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mood & Genre Card */}
      {(() => {
        const { genre, mood, moodColor } = getMoodAndGenre(analysis.bpm, analysis.energy, analysis.danceability);
        const moodBgs: Record<string, string> = {
          Euphoric: "from-pink-900/40 to-pink-950/20",
          Intense: "from-orange-900/40 to-orange-950/20",
          Groovy: "from-violet-900/40 to-violet-950/20",
          Energetic: "from-sky-900/40 to-sky-950/20",
          Chill: "from-emerald-900/40 to-emerald-950/20",
          Melancholic: "from-indigo-900/40 to-indigo-950/20",
          Calm: "from-cyan-900/40 to-cyan-950/20",
          Relaxed: "from-teal-900/40 to-teal-950/20",
        };
        return (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${moodBgs[mood] ?? "from-violet-900/40 to-violet-950/20"} ring-1 ring-white/8`}>
              <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${moodColor}, transparent)` }} />
              <div className="flex flex-wrap items-center justify-between gap-5">
                <div className="space-y-1">
                  <p className="text-wide-display text-white/40">Mood & Genre Analysis</p>
                  <div className="flex items-center gap-3 flex-wrap mt-2">
                    <span className="font-display text-[2rem] font-[800] tracking-tight" style={{ color: moodColor }}>
                      {mood}
                    </span>
                    <span className="text-white/30 text-[1.5rem] font-light">·</span>
                    <span className="font-body text-[1.1rem] font-[500] text-white/70 italic">{genre}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {[
                    { key: "Energy", val: `${(analysis.energy * 100).toFixed(0)}%`, color: "#f59e0b" },
                    { key: "Dance", val: `${(analysis.danceability * 100).toFixed(0)}%`, color: "#34d399" },
                    { key: "BPM", val: Math.round(analysis.bpm).toString(), color: moodColor },
                  ].map(m => (
                    <div key={m.key} className="text-center px-4 py-3 rounded-xl bg-white/5 ring-1 ring-white/8 min-w-[72px]">
                      <p className="text-big-num text-[22px]" style={{ color: m.color }}>{m.val}</p>
                      <p className="label-xs mt-1">{m.key}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* Cellular Resonance + Frequency Spectrum */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Resonance Score */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="vb-card h-full">
            <div className="relative z-10 p-5 flex flex-col h-full">
              <div className="flex items-center gap-2.5 mb-5">
                <div className={`w-9 h-9 rounded-xl ${resonanceColor.replace("text-", "bg-").replace("500", "500/10").replace("400", "400/10")} flex items-center justify-center ring-1 ring-white/6`}>
                  <CellIcon className={`w-4.5 h-4.5 ${resonanceColor}`} />
                </div>
                <div>
                  <p className="font-display font-700 text-[13.5px] tracking-tight">Cellular Resonance</p>
                  <p className="text-[11.5px] text-muted-foreground font-body">Biofield impact score</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                <ResonanceGauge score={cellularResonance.score} />
                <CategoryBadge category={cellularResonance.category} />
                <p className="text-[12px] text-muted-foreground text-center leading-relaxed font-body mt-1">
                  {cellularResonance.assessment}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Frequency Spectrum */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2"
        >
          <div className="vb-card h-full">
            <div className="relative z-10 p-5 flex flex-col h-full">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-white/6">
                  <FrequencyIcon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-700 text-[13.5px] tracking-tight">Frequency Spectrum</p>
                  <p className="text-[11.5px] text-muted-foreground font-body">Audio energy across 7 bands</p>
                </div>
              </div>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.frequencySpectrum} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                    <XAxis
                      dataKey="label"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      fontFamily="JetBrains Mono"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      fontFamily="JetBrains Mono"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      domain={[0, 1]}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "hsl(var(--muted)/0.35)", radius: 6 }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.875rem",
                        fontSize: "12px",
                        fontFamily: "JetBrains Mono",
                        boxShadow: "var(--shadow-lg)",
                      }}
                      formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, "Amplitude"]}
                    />
                    <Bar dataKey="amplitude" radius={[8, 8, 0, 0]}>
                      {analysis.frequencySpectrum.map((_, i) => (
                        <Cell key={i} fill={BAND_COLORS[i % BAND_COLORS.length]} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Healing Frequencies */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="vb-card">
          <div className="relative z-10 p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center ring-1 ring-white/6">
                <DnaIcon className="w-4.5 h-4.5 text-violet-400" />
              </div>
              <div>
                <p className="font-display font-700 text-[13.5px] tracking-tight">Healing Frequency Alignment</p>
                <p className="text-[11.5px] text-muted-foreground font-body">Resonance with solfeggio, bioacoustic &amp; Schumann frequencies</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topFreqs.map((freq, i) => (
                <motion.div
                  key={freq.frequency}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="p-4 rounded-xl bg-muted/25 ring-1 ring-border/40 space-y-2.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-display font-700 leading-tight tracking-tight">{freq.name}</p>
                    <span className="font-mono-custom text-[11px] bg-background/70 ring-1 ring-border/60 px-2 py-0.5 rounded-lg shrink-0 text-muted-foreground">
                      {freq.frequency} Hz
                    </span>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground leading-relaxed font-body">{freq.benefit}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground font-body">Presence</span>
                      <span className="font-mono-custom text-foreground font-semibold">{(freq.presence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="vb-bar-track">
                      <motion.div
                        className="vb-bar-fill"
                        style={{ background: "linear-gradient(90deg, hsl(var(--primary)), #22d3ee)" }}
                        initial={{ width: 0 }}
                        animate={{ width: `${freq.presence * 100}%` }}
                        transition={{ duration: 1.0, delay: 0.55 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tempo Variations */}
      {analysis.tempoChanges.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="vb-card">
            <div className="relative z-10 p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center ring-1 ring-white/6">
                  <BpmIcon className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-display font-700 text-[13.5px] tracking-tight">Tempo Variations</p>
                  <p className="text-[11.5px] text-muted-foreground font-body">BPM profile across the track timeline</p>
                </div>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analysis.tempoChanges}>
                    <defs>
                      <linearGradient id="bpmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.5} />
                    <XAxis
                      dataKey="timestamp"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      fontFamily="JetBrains Mono"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => {
                        const m = Math.floor(v / 60);
                        const s = Math.floor(v % 60);
                        return `${m}:${String(s).padStart(2, "0")}`;
                      }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      fontFamily="JetBrains Mono"
                      tickLine={false}
                      axisLine={false}
                      domain={["dataMin - 8", "dataMax + 8"]}
                      tickFormatter={(v) => `${Math.round(v)}`}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.875rem",
                        fontSize: "12px",
                        fontFamily: "JetBrains Mono",
                        boxShadow: "var(--shadow-lg)",
                      }}
                      labelFormatter={(v) => {
                        const m = Math.floor(Number(v) / 60);
                        const s = Math.floor(Number(v) % 60);
                        return `Time: ${m}:${String(s).padStart(2, "0")}`;
                      }}
                      formatter={(v: number) => [`${Math.round(v)} BPM`, "Tempo"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="bpm"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#bpmGrad)"
                      dot={{ fill: "hsl(var(--primary))", r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Dominant Frequency */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row gap-4 sm:items-center p-5 rounded-2xl bg-primary/5 ring-1 ring-primary/14"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/12 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
          <FrequencyIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-display font-700 text-[14px] tracking-tight">
            Dominant Frequency: <span className="gradient-text-cyan">{analysis.dominantFrequency} Hz</span>
          </p>
          <p className="text-[12.5px] text-muted-foreground mt-0.5 leading-relaxed font-body">
            The primary resonant frequency of this track. Frequencies between 432–528 Hz are associated
            with natural cellular harmony in bioacoustic research.
          </p>
        </div>
        <div className="shrink-0">
          <span className="font-mono-custom text-[14px] font-semibold px-4 py-1.5 rounded-xl ring-1 ring-primary/25 bg-primary/8 text-primary">
            {analysis.dominantFrequency} Hz
          </span>
        </div>
      </motion.div>
    </div>
  );
}
