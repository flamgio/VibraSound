import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BpmIcon, MusicNoteIcon, ArrowRightIcon, WaveformIcon,
  CellIcon, AlertIcon, SparkleIcon
} from "@/components/icons";

interface TrackAnalysis {
  id: number;
  title: string;
  url: string;
  bpm: number;
  key: string;
  energy: number;
  danceability: number;
  cellularResonance: { score: number; category: string; assessment: string };
  createdAt: string;
}

interface PlaylistResult {
  url: string;
  status: "success" | "error";
  analysis?: TrackAnalysis;
  error?: string;
}

interface PlaylistData {
  total: number;
  succeeded: number;
  failed: number;
  results: PlaylistResult[];
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#a78bfa" : score >= 40 ? "#f59e0b" : "#f87171";
  const r = 22, c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className="shrink-0">
      <circle cx="30" cy="30" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
      <circle
        cx="30" cy="30" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform="rotate(-90 30 30)"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <text x="30" y="35.5" textAnchor="middle" fontSize="13" fontWeight="700"
        fontFamily="JetBrains Mono" fill={color}>{score}</text>
    </svg>
  );
}

function getCategoryInfo(cat: string) {
  const map: Record<string, { label: string; cls: string }> = {
    highly_beneficial: { label: "Highly Beneficial", cls: "text-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/20" },
    beneficial: { label: "Beneficial", cls: "text-violet-400 bg-violet-500/10 ring-1 ring-violet-500/20" },
    neutral: { label: "Neutral", cls: "text-amber-500 bg-amber-500/10 ring-1 ring-amber-500/20" },
    potentially_harmful: { label: "Potentially Harmful", cls: "text-red-500 bg-red-500/10 ring-1 ring-red-500/20" },
  };
  return map[cat] ?? { label: cat.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join(" "), cls: "text-muted-foreground bg-muted/40 ring-1 ring-border/40" };
}

export default function PlaylistResults() {
  const [, setLocation] = useLocation();
  const [data, setData] = useState<PlaylistData | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "bpm" | "energy" | "resonance">("default");

  useEffect(() => {
    const stored = sessionStorage.getItem("playlist_results");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto pt-10 space-y-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[100px] rounded-2xl" />)}
      </div>
    );
  }

  const successResults = data.results.filter(r => r.status === "success" && r.analysis);
  const errorResults = data.results.filter(r => r.status === "error");

  const sorted = [...successResults].sort((a, b) => {
    if (!a.analysis || !b.analysis) return 0;
    switch (sortBy) {
      case "bpm": return b.analysis.bpm - a.analysis.bpm;
      case "energy": return b.analysis.energy - a.analysis.energy;
      case "resonance": return b.analysis.cellularResonance.score - a.analysis.cellularResonance.score;
      default: return 0;
    }
  });

  const avgBpm = successResults.length > 0
    ? Math.round(successResults.reduce((s, r) => s + (r.analysis?.bpm ?? 0), 0) / successResults.length)
    : 0;
  const avgResonance = successResults.length > 0
    ? Math.round(successResults.reduce((s, r) => s + (r.analysis?.cellularResonance.score ?? 0), 0) / successResults.length)
    : 0;
  const avgEnergy = successResults.length > 0
    ? Math.round((successResults.reduce((s, r) => s + (r.analysis?.energy ?? 0), 0) / successResults.length) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-16 space-y-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/18">
              <WaveformIcon className="w-4 h-4 text-primary" />
            </div>
            <h1 className="font-display text-[1.75rem] font-700 tracking-tight">Playlist Analysis</h1>
          </div>
          <p className="text-[13px] text-muted-foreground font-body ml-0.5">
            {data.succeeded} of {data.total} tracks analyzed successfully
            {data.failed > 0 && <span className="text-destructive/70"> · {data.failed} failed</span>}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2 rounded-xl h-9 text-[13px] font-body">
            <WaveformIcon className="w-4 h-4" />Analyze More
          </Button>
        </Link>
      </motion.div>

      {/* Summary Stats */}
      {successResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Avg BPM", value: avgBpm.toString(), Icon: BpmIcon, iconColor: "text-violet-400", iconBg: "bg-violet-500/10", line: "linear-gradient(90deg, #a78bfa, #818cf8)" },
            { label: "Avg Resonance", value: `${avgResonance}/100`, Icon: CellIcon, iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10", line: "linear-gradient(90deg, #34d399, #10b981)" },
            { label: "Avg Energy", value: `${avgEnergy}%`, Icon: SparkleIcon, iconColor: "text-amber-400", iconBg: "bg-amber-500/10", line: "linear-gradient(90deg, #f59e0b, #fbbf24)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="vb-card vb-metric"
              style={{ "--metric-line": stat.line } as React.CSSProperties}
            >
              <div className="relative z-10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                    <stat.Icon className={`w-3 h-3 ${stat.iconColor}`} />
                  </div>
                  <span className="label-xs">{stat.label}</span>
                </div>
                <p className="font-display text-[1.6rem] font-700 tracking-tight data-num leading-none">{stat.value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Sort controls */}
      {successResults.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="flex items-center gap-2 flex-wrap"
        >
          <span className="text-[11px] text-muted-foreground font-mono-custom uppercase tracking-wider">Sort by:</span>
          {(["default", "bpm", "energy", "resonance"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-200 font-body ${
                sortBy === s
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground ring-1 ring-border/40"
              }`}
            >
              {s === "default" ? "Default" : s === "bpm" ? "BPM" : s === "energy" ? "Energy" : "Resonance"}
            </button>
          ))}
        </motion.div>
      )}

      {/* Track List */}
      <div className="space-y-2.5">
        {sorted.map((result, index) => {
          if (!result.analysis) return null;
          const { analysis } = result;
          const cr = analysis.cellularResonance;
          const { label, cls } = getCategoryInfo(cr.category);
          return (
            <motion.div
              key={result.url}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/analysis/${analysis.id}`}>
                <div className="vb-card cursor-pointer group">
                  <div className="relative z-10 p-4 flex items-center gap-4">
                    {/* Track number */}
                    <div className="w-8 h-8 rounded-xl bg-muted/40 ring-1 ring-border/30 flex items-center justify-center shrink-0 text-[12px] font-mono-custom font-semibold text-muted-foreground">
                      {index + 1}
                    </div>

                    {/* Score ring */}
                    <ScoreRing score={cr.score} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-700 text-[14px] tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {analysis.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                        <span className="flex items-center gap-1 text-[11.5px] font-mono-custom text-muted-foreground">
                          <BpmIcon className="w-3 h-3" />{Math.round(analysis.bpm)} BPM
                        </span>
                        <span className="flex items-center gap-1 text-[11.5px] font-mono-custom text-muted-foreground">
                          <MusicNoteIcon className="w-3 h-3" />{analysis.key}
                        </span>
                        <span className="text-[11.5px] font-mono-custom text-muted-foreground">
                          {(analysis.energy * 100).toFixed(0)}% energy
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold font-body ${cls}`}>
                          {label}
                        </span>
                      </div>
                    </div>

                    <ArrowRightIcon className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}

        {/* Failed tracks */}
        {errorResults.map((result, i) => (
          <motion.div
            key={result.url}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (sorted.length + i) * 0.04 }}
          >
            <div className="p-4 rounded-2xl ring-1 ring-destructive/20 bg-destructive/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertIcon className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-destructive font-body">Failed to analyze</p>
                <p className="text-[11.5px] text-muted-foreground truncate mt-0.5 font-mono-custom">{result.url}</p>
                {result.error && <p className="text-[11.5px] text-destructive/60 mt-0.5 font-body">{result.error}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
