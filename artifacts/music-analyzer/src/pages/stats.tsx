import { useGetAnalysisStats } from "@workspace/api-client-react";
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
  beneficial: { label: "Beneficial", color: "#a78bfa" },
  neutral: { label: "Neutral", color: "#f59e0b" },
  potentially_harmful: { label: "Potentially Harmful", color: "#f87171" },
};

function StatCard({
  label, value, sub, icon: Icon, iconColor, iconBg, line, delay
}: {
  label: string; value: string | number; sub: string;
  icon: React.FC<{ className?: string }>; iconColor: string; iconBg: string;
  line: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="vb-card vb-metric"
        style={{ "--metric-line": line } as React.CSSProperties}
      >
        <div className="relative z-10 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="label-xs opacity-65">{label}</p>
            <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center ring-1 ring-white/6`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
          </div>
          <div className="font-display text-[2rem] font-700 tracking-tight leading-none data-num">{value}</div>
          <p className="text-[12px] text-muted-foreground font-body mt-1.5">{sub}</p>
        </div>
      </div>
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

  const resonanceScore = stats ? Math.round(stats.averageCellularScore) : 0;
  const resonanceColor =
    resonanceScore >= 70 ? "#10b981" :
    resonanceScore >= 50 ? "#a78bfa" : "#f59e0b";

  return (
    <div className="space-y-8 pt-10 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3.5"
      >
        <div className="w-11 h-11 rounded-2xl bg-primary/8 ring-1 ring-primary/18 flex items-center justify-center">
          <ChartBarIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-[1.75rem] font-700 tracking-tight leading-tight">Global Statistics</h1>
          <p className="text-[13px] text-muted-foreground font-body mt-0.5">Aggregated data across all analyzed tracks</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[130px] rounded-2xl" />)}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-[340px] rounded-2xl" />
            <Skeleton className="h-[340px] rounded-2xl" />
          </div>
        </div>
      ) : stats ? (
        <div className="space-y-5">
          {/* Stat Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Analyzed"
              value={stats.totalAnalyses}
              sub="Tracks processed"
              icon={WaveformIcon}
              iconColor="text-violet-400"
              iconBg="bg-violet-500/10"
              line="linear-gradient(90deg, #a78bfa, #818cf8)"
              delay={0.08}
            />
            <StatCard
              label="Average BPM"
              value={Math.round(stats.averageBpm)}
              sub="Beats per minute"
              icon={BpmIcon}
              iconColor="text-cyan-400"
              iconBg="bg-cyan-500/10"
              line="linear-gradient(90deg, #22d3ee, #38bdf8)"
              delay={0.14}
            />
            <StatCard
              label="Avg Resonance"
              value={`${resonanceScore}/100`}
              sub="Cellular score"
              icon={CellIcon}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10"
              line="linear-gradient(90deg, #34d399, #10b981)"
              delay={0.2}
            />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="vb-card vb-metric"
                style={{ "--metric-line": "linear-gradient(90deg, #f472b6, #fb7185)" } as React.CSSProperties}
              >
                <div className="relative z-10 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="label-xs opacity-65">Top Healing Tone</p>
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center ring-1 ring-white/6">
                      <DnaIcon className="w-4 h-4 text-rose-400" />
                    </div>
                  </div>
                  <div className="font-display text-[15px] font-700 leading-snug tracking-tight line-clamp-2">
                    {stats.topHealingFrequency}
                  </div>
                  <p className="text-[12px] text-muted-foreground font-body mt-1.5">Most detected across analyses</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Resonance Gauge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="vb-card h-full">
                <div className="relative z-10 p-5 flex flex-col">
                  <div className="mb-5">
                    <p className="font-display font-700 text-[14px] tracking-tight">Average Cellular Resonance</p>
                    <p className="text-[12px] text-muted-foreground font-body mt-0.5">Global biofield impact score</p>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="relative">
                      <ResponsiveContainer width={200} height={200}>
                        <RadialBarChart
                          cx="50%" cy="50%"
                          innerRadius="62%" outerRadius="94%"
                          data={[{ value: resonanceScore, fill: resonanceColor }]}
                          startAngle={220} endAngle={-40}
                          barSize={18}
                        >
                          <RadialBar
                            dataKey="value"
                            cornerRadius={9}
                            background={{ fill: "hsl(var(--muted))", radius: 9 } as never}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className="data-num font-display font-700"
                          style={{ color: resonanceColor, fontSize: "42px", letterSpacing: "-0.04em" }}
                        >
                          {resonanceScore}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono-custom tracking-wider">/ 100</span>
                      </div>
                    </div>
                    <p className="text-[12.5px] text-muted-foreground text-center mt-2 font-body leading-relaxed max-w-[240px]">
                      {resonanceScore >= 70
                        ? "Overall beneficial resonance profile across analyzed tracks"
                        : resonanceScore >= 50
                        ? "Moderate cellular resonance across analyzed tracks"
                        : "Low resonance — try analyzing healing-frequency tracks"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="vb-card h-full">
                <div className="relative z-10 p-5 flex flex-col">
                  <div className="mb-5">
                    <p className="font-display font-700 text-[14px] tracking-tight">Cellular Impact Breakdown</p>
                    <p className="text-[12px] text-muted-foreground font-body mt-0.5">Distribution by resonance category</p>
                  </div>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={270}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%" cy="44%"
                          innerRadius={58}
                          outerRadius={92}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} fillOpacity={0.88} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.875rem",
                            fontSize: "12px",
                            fontFamily: "JetBrains Mono",
                            boxShadow: "var(--shadow-lg)",
                          }}
                          formatter={(v: number, _: string, props: { payload?: { label?: string } }) => [
                            `${v} tracks`,
                            props.payload?.label ?? ""
                          ]}
                        />
                        <Legend
                          iconType="circle"
                          iconSize={8}
                          formatter={(value: string) => (
                            <span style={{ fontFamily: "Outfit", fontSize: "12px", color: "hsl(var(--foreground))", opacity: 0.75 }}>
                              {CATEGORY_CONFIG[value]?.label ?? value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12">
                      <ChartBarIcon className="w-10 h-10 text-muted-foreground/25" />
                      <p className="text-[13px] text-muted-foreground font-body">
                        No data yet. Analyze some tracks first.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
