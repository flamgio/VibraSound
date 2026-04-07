import { useGetAnalysisStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, BarChart2, Hash, HeartPulse, PieChart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function Stats() {
  const { data: stats, isLoading } = useGetAnalysisStats();

  const getCategoryColor = (name: string) => {
    switch (name) {
      case "highly_beneficial": return "hsl(var(--chart-1))";
      case "beneficial": return "hsl(var(--chart-2))";
      case "neutral": return "hsl(var(--chart-3))";
      case "potentially_harmful": return "hsl(var(--destructive))";
      default: return "hsl(var(--muted))";
    }
  };

  const getCategoryLabel = (name: string) => {
    return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const pieData = stats ? Object.entries(stats.categoryBreakdown).map(([name, value]) => ({
    name,
    value,
    label: getCategoryLabel(name)
  })).filter(d => d.value > 0) : [];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Statistics</h1>
        <p className="text-muted-foreground mt-2">Aggregated data across all analyzed tracks</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-2/3" />
              </CardContent>
            </Card>
          ))}
          <Card className="col-span-full bg-card/50 backdrop-blur border-border/50 mt-4">
            <CardHeader>
              <Skeleton className="h-5 w-1/4" />
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
            </CardContent>
          </Card>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="bg-card/50 backdrop-blur border-border/50 glow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Analyzed</CardTitle>
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalAnalyses}</div>
                  <p className="text-xs text-muted-foreground mt-1">Tracks processed globally</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-card/50 backdrop-blur border-border/50 glow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average BPM</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round(stats.averageBpm)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Beats per minute</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-card/50 backdrop-blur border-border/50 glow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Resonance</CardTitle>
                  <HeartPulse className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round(stats.averageCellularScore)} / 100</div>
                  <p className="text-xs text-muted-foreground mt-1">Overall cellular score</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-card/50 backdrop-blur border-border/50 glow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Frequency</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold line-clamp-1">{stats.topHealingFrequency}</div>
                  <p className="text-xs text-muted-foreground mt-1">Most common healing tone</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Cellular Impact Breakdown
                </CardTitle>
                <CardDescription>Distribution of tracks by their resonance assessment</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="label"
                        label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No breakdown data available yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
}
