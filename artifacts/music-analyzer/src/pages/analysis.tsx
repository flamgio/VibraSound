import { useParams, Link } from "wouter";
import { useGetAnalysis, getGetAnalysisQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, BarChart, Bar, Cell, RadialBarChart, RadialBar
} from "recharts";
import {
  BpmIcon, MusicNoteIcon, EnergyIcon, CellIcon, DnaIcon, FrequencyIcon,
  ArrowLeftIcon, ExternalLinkIcon, AlertIcon, WaveformIcon, YoutubeIcon, SparkleIcon
} from "@/components/icons";

function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, { label: string; className: string }> = {
    highly_beneficial: { label: "Highly Beneficial", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400" },
    beneficial: { label: "Beneficial", className: "bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400" },
    neutral: { label: "Neutral", className: "bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400" },
    potentially_harmful: { label: "Potentially Harmful", className: "bg-red-500/15 text-red-600 border-red-500/25 dark:text-red-400" },
  };
  const { label, className } = map[category] ?? { label: category, className: "" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}>
      {label}
    </span>
  );
}

function ResonanceGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? "#10b981" :
    score >= 60 ? "#6366f1" :
    score >= 40 ? "#f59e0b" : "#ef4444";

  const data = [{ value: score, fill: color }];

  return (
    <div className="relative flex flex-col items-center justify-center">
      <ResponsiveContainer width={160} height={160}>
        <RadialBarChart
          cx="50%" cy="50%"
          innerRadius="70%" outerRadius="100%"
          data={data}
          startAngle={220} endAngle={-40}
          barSize={12}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: "hsl(var(--muted))", radius: 6 } as never}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-mono" style={{ color }}>{score}</span>
        <span className="text-xs text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  );
}

const BAND_COLORS = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--chart-1))", "hsl(var(--chart-2))"
];

function isYouTubeUrl(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export default function AnalysisDetail() {
  const params = useParams();
  const id = params.id ? parseInt(params.id) : 0;

  const { data: analysis, isLoading, isError, error } = useGetAnalysis(id, {
    query: { enabled: !!id && !isNaN(id), queryKey: getGetAnalysisQueryKey(id) }
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertIcon className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Analysis Not Found</h2>
          <p className="text-muted-foreground mt-1 max-w-sm">
            {(error as Error)?.message || "This analysis doesn't exist or could not be loaded."}
          </p>
        </div>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeftIcon className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading || !analysis) {
    return (
      <div className="space-y-8 pt-8">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <Skeleton className="h-10 w-2/3 rounded-xl" />
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
    cellularResonance.score >= 60 ? "text-primary" :
    cellularResonance.score >= 40 ? "text-amber-500" : "text-red-500";

  const topFreqs = [...cellularResonance.healingFrequencies]
    .sort((a, b) => b.presence - a.presence)
    .slice(0, 5);

  return (
    <div className="space-y-8 pt-8 pb-16">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 rounded-xl hover:bg-muted/70">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-sm text-muted-foreground">Analysis #{analysis.id}</span>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-3"
      >
        <div className="flex flex-wrap items-start gap-3">
          {isYouTubeUrl(analysis.url) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold">
              <YoutubeIcon className="w-3.5 h-3.5" />
              YouTube
            </div>
          )}
          <CategoryBadge category={cellularResonance.category} />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          {analysis.title}
        </h1>
        <div className="flex items-center flex-wrap gap-3">
          <a
            href={analysis.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            data-testid="link-source"
          >
            <ExternalLinkIcon className="w-4 h-4" />
            View Original Source
          </a>
          <Link href={`/lyrics/${analysis.id}`}>
            <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-500 hover:text-violet-400 transition-colors group" data-testid="link-lyrics">
              <SparkleIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Get Lyrics + Animations
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Tempo",
            value: <>{Math.round(analysis.bpm)} <span className="text-lg font-normal text-muted-foreground">BPM</span></>,
            icon: BpmIcon,
            color: "text-primary",
            bgColor: "bg-primary/10",
            delay: 0.1,
          },
          {
            label: "Musical Key",
            value: analysis.key,
            icon: MusicNoteIcon,
            color: "text-violet-500",
            bgColor: "bg-violet-500/10",
            delay: 0.15,
          },
          {
            label: "Energy Level",
            value: <>{(analysis.energy * 100).toFixed(0)}<span className="text-lg font-normal text-muted-foreground">%</span></>,
            icon: EnergyIcon,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            delay: 0.2,
          },
          {
            label: "Danceability",
            value: <>{(analysis.danceability * 100).toFixed(0)}<span className="text-lg font-normal text-muted-foreground">%</span></>,
            icon: WaveformIcon,
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10",
            delay: 0.25,
          },
        ].map((metric) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: metric.delay }}
          >
            <Card className="glass-card border-0 rounded-2xl h-full">
              <CardHeader className="pb-2 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {metric.label}
                  </CardTitle>
                  <div className={`w-8 h-8 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="text-3xl font-bold font-display">{metric.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Cellular Resonance + Frequency */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Resonance Score */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-0 rounded-2xl h-full">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center ${resonanceColor}`}>
                  <CellIcon className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Cellular Resonance</CardTitle>
                  <CardDescription className="text-xs">Biofield impact score</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 flex flex-col items-center gap-4">
              <ResonanceGauge score={cellularResonance.score} />
              <CategoryBadge category={cellularResonance.category} />
              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                {cellularResonance.assessment}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Frequency Spectrum */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card border-0 rounded-2xl h-full">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FrequencyIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Frequency Spectrum</CardTitle>
                  <CardDescription className="text-xs">Audio energy distribution across 7 bands</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.frequencySpectrum} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="label"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    domain={[0, 1]}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "hsl(var(--muted)/0.4)", radius: 6 }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                    formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, "Amplitude"]}
                  />
                  <Bar dataKey="amplitude" radius={[6, 6, 0, 0]}>
                    {analysis.frequencySpectrum.map((_, i) => (
                      <Cell key={i} fill={BAND_COLORS[i % BAND_COLORS.length]} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Healing Frequencies */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-0 rounded-2xl">
          <CardHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <DnaIcon className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">Healing Frequency Alignment</CardTitle>
                <CardDescription className="text-xs">
                  Resonance with solfeggio, bioacoustic, and Schumann frequencies
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topFreqs.map((freq, i) => (
                <motion.div
                  key={freq.frequency}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42 + i * 0.05 }}
                  className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-tight">{freq.name}</p>
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs shrink-0 bg-background/80"
                    >
                      {freq.frequency} Hz
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{freq.benefit}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Presence</span>
                      <span className="font-medium font-mono">{(freq.presence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${freq.presence * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tempo Variations */}
      {analysis.tempoChanges.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card border-0 rounded-2xl">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <BpmIcon className="w-4 h-4 text-cyan-500" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">Tempo Variations</CardTitle>
                  <CardDescription className="text-xs">BPM profile across the track timeline</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysis.tempoChanges}>
                  <defs>
                    <linearGradient id="bpmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
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
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={["dataMin - 8", "dataMax + 8"]}
                    tickFormatter={(v) => `${Math.round(v)}`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
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
                    activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Dominant Frequency Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="p-5 rounded-2xl bg-muted/40 border border-border/50 flex flex-col sm:flex-row gap-4 sm:items-center"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FrequencyIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">Dominant Frequency: {analysis.dominantFrequency} Hz</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            The primary resonant frequency of this track. Frequencies between 432–528 Hz are associated
            with natural cellular harmony in bioacoustic research.
          </p>
        </div>
        <div className="shrink-0">
          <Badge variant="outline" className="font-mono text-sm px-3 py-1">
            {analysis.dominantFrequency} Hz
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}
