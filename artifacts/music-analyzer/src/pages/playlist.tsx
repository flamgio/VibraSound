import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
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
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#6366f1" : score >= 40 ? "#f59e0b" : "#ef4444";
  const r = 20, c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
      <circle
        cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform="rotate(-90 28 28)"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>{score}</text>
    </svg>
  );
}

function getCategoryLabel(cat: string) {
  return cat.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function getCategoryColors(cat: string) {
  const m: Record<string, string> = {
    highly_beneficial: "bg-emerald-500/12 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
    beneficial: "bg-primary/12 text-primary border-primary/25",
    neutral: "bg-amber-500/12 text-amber-600 border-amber-500/25 dark:text-amber-400",
    potentially_harmful: "bg-red-500/12 text-red-600 border-red-500/25 dark:text-red-400",
  };
  return m[cat] ?? "";
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
      <div className="max-w-5xl mx-auto pt-8 space-y-4">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
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
    <div className="max-w-5xl mx-auto pt-8 pb-16 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <WaveformIcon className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl font-bold tracking-tight">Playlist Analysis</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.succeeded} of {data.total} tracks analyzed successfully
            {data.failed > 0 && ` · ${data.failed} failed`}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2 rounded-xl h-9 text-sm">
            <WaveformIcon className="w-4 h-4" />Analyze More
          </Button>
        </Link>
      </motion.div>

      {/* Summary Stats */}
      {successResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: "Avg BPM", value: avgBpm, icon: BpmIcon, color: "text-primary", bg: "bg-primary/10" },
            { label: "Avg Resonance", value: `${avgResonance}/100`, icon: CellIcon, color: "text-violet-500", bg: "bg-violet-500/10" },
            { label: "Avg Energy", value: `${avgEnergy}%`, icon: SparkleIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl bg-background/50 backdrop-blur border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold font-display">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Sort controls */}
      {successResults.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Sort by:</span>
          {(["default", "bpm", "energy", "resonance"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === s ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "default" ? "Default" : s === "bpm" ? "BPM" : s === "energy" ? "Energy" : "Resonance"}
            </button>
          ))}
        </div>
      )}

      {/* Track List */}
      <div className="space-y-3">
        {sorted.map((result, index) => {
          if (!result.analysis) return null;
          const { analysis } = result;
          const cr = analysis.cellularResonance;
          return (
            <motion.div
              key={result.url}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.04 }}
            >
              <Link href={`/analysis/${analysis.id}`}>
                <Card className="group glass-card border-0 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <CardContent className="p-5 flex items-center gap-4">
                    {/* Track number */}
                    <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                      {index + 1}
                    </div>

                    {/* Resonance ring */}
                    <ScoreRing score={cr.score} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {analysis.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BpmIcon className="w-3 h-3" />{Math.round(analysis.bpm)} BPM
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MusicNoteIcon className="w-3 h-3" />{analysis.key}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Energy {(analysis.energy * 100).toFixed(0)}%
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${getCategoryColors(cr.category)}`}>
                          {getCategoryLabel(cr.category)}
                        </span>
                      </div>
                    </div>

                    <ArrowRightIcon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </CardContent>
                </Card>
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
            <div className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5 flex items-center gap-3">
              <AlertIcon className="w-5 h-5 text-destructive shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-destructive">Failed to analyze</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{result.url}</p>
                {result.error && <p className="text-xs text-destructive/70 mt-0.5">{result.error}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
