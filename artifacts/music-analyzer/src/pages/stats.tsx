import { useGetAnalysisStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, Legend
} from "recharts";
import {
  ChartBarIcon, BpmIcon, CellIcon, DnaIcon, WaveformIcon
} from "@/components/icons";

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  highly_beneficial: { label: "Highly Beneficial", color: "#10b981" },
  beneficial: { label: "Beneficial", color: "hsl(239, 84%, 67%)" },
  neutral: { label: "Neutral", color: "#f59e0b" },
  potentially_harmful: { label: "Potentially Harmful", color: "#ef4444" },
};

function StatCard({
  label, value, sub, icon: Icon, color, bg, delay
}: {
  label: string; value: string | number; sub: string;
  icon: React.FC<{ className?: string }>; color: string; bg: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="glass-card border-0 rounded-2xl">
        <CardHeader className="px-5 pt-5 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </CardTitle>
          <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="text-3xl font-bold font-display">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Stats() {
  const { data: stats, isLoading } = useGetAnalysisStats();

  const pieData = stats
    ? Object.entries(stats.categoryBreakdown)
        .map(([name, value]) => ({
          name,
          value,
          label: CATEGORY_CONFIG[name]?.label ?? name,
          color: CATEGORY_CONFIG[name]?.color ?? "#888",
        }))
        .filter((d) => d.value > 0)
    : [];

  const resonanceData = stats
    ? [{ value: stats.averageCellularScore, fill: "#6366f1" }]
    : [];

  return (
    <div className="space-y-8 pt-8 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ChartBarIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Global Statistics</h1>
          <p className="text-sm text-muted-foreground">Aggregated data across all analyzed tracks</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      ) : stats ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Analyzed"
              value={stats.totalAnalyses}
              sub="Tracks processed"
              icon={WaveformIcon}
              color="text-primary"
              bg="bg-primary/10"
              delay={0.1}
            />
            <StatCard
              label="Average BPM"
              value={Math.round(stats.averageBpm)}
              sub="Beats per minute"
              icon={BpmIcon}
              color="text-cyan-500"
              bg="bg-cyan-500/10"
              delay={0.15}
            />
            <StatCard
              label="Avg Resonance"
              value={`${Math.round(stats.averageCellularScore)} / 100`}
              sub="Cellular score"
              icon={CellIcon}
              color="text-violet-500"
              bg="bg-violet-500/10"
              delay={0.2}
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="glass-card border-0 rounded-2xl">
                <CardHeader className="px-5 pt-5 pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Top Healing Tone
                  </CardTitle>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <DnaIcon className="w-4 h-4 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="text-base font-bold font-display leading-snug line-clamp-2">{stats.topHealingFrequency}</div>
                  <p className="text-xs text-muted-foreground mt-1">Most detected across analyses</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Resonance Gauge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="glass-card border-0 rounded-2xl h-full">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-sm font-semibold">Average Cellular Resonance</CardTitle>
                  <CardDescription className="text-xs">Global biofield impact score</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 flex flex-col items-center">
                  <div className="relative">
                    <ResponsiveContainer width={200} height={200}>
                      <RadialBarChart
                        cx="50%" cy="50%"
                        innerRadius="65%" outerRadius="95%"
                        data={resonanceData}
                        startAngle={220} endAngle={-40}
                        barSize={16}
                      >
                        <RadialBar
                          dataKey="value"
                          cornerRadius={8}
                          background={{ fill: "hsl(var(--muted))", radius: 8 } as never}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold font-mono text-primary">
                        {Math.round(stats.averageCellularScore)}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">/ 100</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {stats.averageCellularScore >= 70
                      ? "Overall beneficial resonance profile across analyzed tracks"
                      : stats.averageCellularScore >= 50
                      ? "Moderate cellular resonance across analyzed tracks"
                      : "Low resonance profile — try analyzing more healing-frequency tracks"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-card border-0 rounded-2xl h-full">
                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-sm font-semibold">Cellular Impact Breakdown</CardTitle>
                  <CardDescription className="text-xs">Distribution by resonance category</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%" cy="45%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} fillOpacity={0.9} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.75rem",
                            fontSize: "12px",
                          }}
                          formatter={(v: number, _: string, props: { payload?: { label?: string } }) => [
                            `${v} tracks`,
                            props.payload?.label ?? ""
                          ]}
                        />
                        <Legend
                          formatter={(value: string) => (
                            <span className="text-xs text-foreground">{CATEGORY_CONFIG[value]?.label ?? value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center gap-3 text-center">
                      <ChartBarIcon className="w-10 h-10 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        No data yet. Analyze some tracks first.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
